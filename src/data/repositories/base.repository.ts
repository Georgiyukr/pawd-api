import { BaseRepositoryInterface } from "./base.interface.repository";

export abstract class BaseRepository<T> implements BaseRepositoryInterface<T> {
    abstract getAll(...rest): Promise<T[] | null | unknown>;
    abstract getById(id: string, ...rest): Promise<T | null | unknown>;
    abstract create(data: T): Promise<T>;
    abstract delete(data: T): Promise<T | null | unknown>;
}
