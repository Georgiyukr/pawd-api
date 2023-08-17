import { BaseRepositoryInterface } from "./base.interface.repository";

export abstract class BaseRepository<T> implements BaseRepositoryInterface<T> {
    abstract getAll(...rest): Promise<T[]>;
    abstract get(filter: any, ...rest): Promise<T>;
    abstract getById(id: string, ...rest: any[]): Promise<T>;
    abstract create(data: T): Promise<T>;
    abstract update(
        filter: Record<string, T>,
        update: Record<string, T>
    ): Promise<T>;
    abstract updateById(id: string, update: T): Promise<T>;
    abstract delete(data: T): Promise<T | null | unknown>;
}
