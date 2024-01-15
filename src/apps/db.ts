export interface DatabaseService<K, V> {
    create(value: V): Promise<K>
    get(id: K): Promise<V | null>
    update(id: K, value: V): void
    delete(id: K): void
}
