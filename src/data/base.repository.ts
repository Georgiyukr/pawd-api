import { BaseRepositoryInterface } from "./base.interface.repository";

export abstract class BaseRepository<T> implements BaseRepositoryInterface<T> {
    abstract getAll(...rest): Promise<T[]>;
    abstract get(filter: any, ...rest): Promise<T>;
    abstract create(data: T): Promise<T>;
    abstract update(filter: T, update: T): Promise<T>;
    abstract delete(data: T): Promise<T | null | unknown>;
}
