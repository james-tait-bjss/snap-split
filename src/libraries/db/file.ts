import { randomUUID } from "crypto"
import * as fslib from "fs"
import { DatabaseService } from "../../apps/db"

export interface FileSystem {
    existsSync(filepath: string): boolean
    mkdirSync(filepath: string, options?: object): void
    readFileSync(filepath: string): string | Buffer
    writeFileSync(filepath: string, content: string): void
}

// TODO: USE QUEUE TO MAKE THREAD SAFE
export class FileDatabase<T> implements DatabaseService<string, T> {
    private store: Map<string, T> = new Map<string, T>()

    constructor(
        private fs: FileSystem,
        private filepath: string,
    ) {
        if (fs.existsSync(filepath)) {
            this.initialiseStoreFromFile()
        } else {
            this.initialiseEmptyStore()
        }
    }

    create(value: T): Promise<string> {
        return new Promise<string>((resolve) => {
            const id = randomUUID()
            this.store.set(id, value)
            this.write()

            resolve(id)
        })
    }

    get(id: string): Promise<T | null> {
        return new Promise<T | null>((resolve) => {
            this.initialiseStoreFromFile()
            const obj = this.store.get(id)

            if (obj === undefined) {
                resolve(null)
            }

            resolve(obj as T)
        })
    }

    update(id: string, value: T): void {
        if (!this.store.has(id)) {
            throw new Error("key doesnt exist")
        }

        this.store.set(id, value)
        this.write()
    }

    delete(id: string): void {
        this.store.delete(id)
        this.write()
    }

    private initialiseStoreFromFile() {
        const buf = this.fs.readFileSync(this.filepath)
        const json = JSON.parse(buf.toString())
        this.store = new Map<string, T>(Object.entries(json))
    }

    private initialiseEmptyStore() {
        this.store = new Map<string, T>()
        const dirpath = this.filepath.split("/").slice(0, -1).join("/")
        this.fs.mkdirSync(dirpath, { recursive: true })
        this.write()
    }

    private write(): void {
        const json = Object.fromEntries(this.store.entries())
        this.fs.writeFileSync(this.filepath, JSON.stringify(json))
    }
}

export default function fileDatabaseFactory<T>(
    filepath: string,
    fs?: FileSystem,
): FileDatabase<T> {
    if (fs === undefined) {
        return new FileDatabase<T>(fslib, filepath)
    }

    return new FileDatabase<T>(fs, filepath)
}
