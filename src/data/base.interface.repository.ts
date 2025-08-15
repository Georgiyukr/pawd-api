export interface BaseRepositoryInterface<T> {
    getAll(...rest): Promise<T[] | null | unknown>
    get(filter: any, ...rest): Promise<T | null | unknown>
    getById(id: string, ...rest): Promise<T>
    create(data: T): Promise<T>
    update(filter: Record<string, T>, update: Record<string, T>): Promise<T>
    updateById(id: string, update: Partial<T>): Promise<T>
    delete(data: T): Promise<T | null | unknown>
    deleteById(id: string, ...rest): Promise<T | null | unknown>
}
