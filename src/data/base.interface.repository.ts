export interface BaseRepositoryInterface<T> {
    getAll(...rest): Promise<T[] | null | unknown>;
    get(filter: any, ...rest): Promise<T | null | unknown>;
    getById(id: string, ...rest): Promise<T>;
    create(data: T): Promise<T>;
    update(filter: T, update: T): Promise<T>;
    updateById(id: string, update: T): Promise<T>;
    delete(data: T): Promise<T | null | unknown>;
}
