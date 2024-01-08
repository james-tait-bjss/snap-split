export interface DatabaseService {
    create(id: string, value: object): void
    get(id: string): object | undefined
    update(id: string, value: object): void
    delete(id: string): void
}