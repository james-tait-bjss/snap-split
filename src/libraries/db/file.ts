import { DatabaseService } from "../../apps/db"
import * as fslib from "fs"

interface FileSystem {
    existsSync(filepath: string): boolean
    mkdirSync(filepath: string, options?: object): void
    readFileSync(filepath: string): string | Buffer
    writeFileSync(filepath: string, content: string): void
}

// TODO: USE QUEUE TO MAKE THREAD SAFE
export class FileDatabase implements DatabaseService {
    private store: Map<string, object> = new Map<string, object>();

    constructor(private fs: FileSystem, private filepath: string) { 
        if (fs.existsSync(filepath)) {
            this.initialiseStoreFromFile()
        } else {
            this.initialiseEmptyStore()
        }
    }

    create(id: string, value: object): void {
        if (this.store.has(id)) {
            throw new Error("key already exists")
        }

        this.store.set(id, value)
        this.write()
    }

    get(id: string): object | undefined{
        this.initialiseStoreFromFile()
        const obj = this.store.get(id)

        return obj
    }

    update(id: string, value: object): void {
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
        this.store = new Map<string, object>(Object.entries(json))
    }

    private initialiseEmptyStore() {
        this.store = new Map<string, object>() 
        const dirpath = this.filepath.split('/').slice(0, -1).join('/')
        this.fs.mkdirSync(dirpath, { recursive: true })
        this.write()
    }

    private write(): void {
        const json = Object.fromEntries(this.store.entries())
        this.fs.writeFileSync(this.filepath, JSON.stringify(json))
    }
}

export default function fileDatabaseFactory(filepath: string, fs?: FileSystem): FileDatabase {
    if (fs === undefined) {
        return new FileDatabase(fslib, filepath)
    }

    return new FileDatabase(fs, filepath)
}