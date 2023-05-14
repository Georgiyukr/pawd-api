import { Document, FilterQuery, Model } from "mongoose";
import { BaseRepositoryInterface } from "../base.interface.repository";
import { BaseMongoQueryOptions, DeleteResult } from "./types";

interface BaseMongoRepositoryInterface<T> extends BaseRepositoryInterface<T> {
    getByCondition(filterCondition: any): Promise<T>;
}

export class BaseMongoRepository<T> implements BaseMongoRepositoryInterface<T> {
    private entity: Model<T>;
    constructor(entity: Model<T>) {
        this.entity = entity;
    }

    async getAll(
        options?: BaseMongoQueryOptions
    ): Promise<T[] | null | unknown> {
        return await this.entity
            .find()
            .populate(options.populate)
            .select(options.select);
    }

    async getById(
        id,
        options?: BaseMongoQueryOptions
    ): Promise<T | null | unknown> {
        return await this.entity
            .findOne(id)
            .populate(options.populate)
            .select(options.select);
    }

    async getByCondition(filterCondition: any): Promise<T> {
        return await this.entity.findOne({ where: filterCondition });
    }

    async create(data: T): Promise<T> {
        const model = new this.entity(data);
        return await model.save(data);
    }

    async delete(data: T): Promise<DeleteResult> {
        return await this.entity.deleteMany(data);
    }
}
