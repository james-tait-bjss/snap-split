export interface DatabaseService<T> {
    create(id: string, value: T): void
    get(id: string): T | undefined
    update(id: string, value: T): void
    delete(id: string): void
}