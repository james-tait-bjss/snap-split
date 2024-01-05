import { DatabaseService } from "../../apps/db"
import * as fs from "fs"

// TODO: USE QUEUE TO MAKE THREAD SAFE
export class FileDatabase implements DatabaseService {
    private store: Map<string, object>

    constructor(private filepath: string) { 
        const buf = fs.readFileSync(this.filepath)
        const json = JSON.parse(buf.toString())

        this.store = new Map<string, object>(Object.entries(json))
    }

    create(id: string, value: object): void {
        this.store.set(id, value)
        this.write()
    }

    get(id: string): object | undefined{
        const obj = this.store.get(id)

        return obj
    }

    private write() {
        const json = Object.fromEntries(this.store.entries())
        fs.writeFileSync(this.filepath, JSON.stringify(json))
    }
}

export default function fileDatabaseFactory(filepath: string): FileDatabase {
    return new FileDatabase(filepath)
}