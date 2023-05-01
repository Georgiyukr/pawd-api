export interface BaseRepositoryInterface<T> {
    abstract getAll(...): Promise<T[] | null |unknown>;
    abstract getById(id: string, ...): Promise<T | null | unknown>;
    abstract create(data: T): Promise<T>;
    abstract delete(data: T): Promise<T | null | unknown>;
}
