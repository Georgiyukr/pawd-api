import { Document, FilterQuery, Model, Query } from "mongoose";
import { BaseRepositoryInterface } from "../base.interface.repository";
import { BaseMongoQueryOptions, DeleteResult } from "./types";
import { formatSingleResponse } from "./formatters";

interface BaseMongoRepositoryInterface<T> extends BaseRepositoryInterface<T> {
    getByCondition(filterCondition: any): Promise<T>;
}

export class BaseMongoRepository<T> implements BaseMongoRepositoryInterface<T> {
    private entity: Model<T>;
    constructor(entity: Model<T>) {
        this.entity = entity;
    }

    async getAll(options?: BaseMongoQueryOptions): Promise<T[]> {
        return await this.entity
            .find()
            .populate(options.populate)
            .select(options.select);
    }

    async getById<T>(id, options?: BaseMongoQueryOptions): Promise<T> {
        const doc: Document = (await this.entity
            .findOne(id)
            .populate(options.populate)
            .select(options.select)) as Document;
        if (!doc) return null;
        return formatSingleResponse(doc);
    }

    async getByCondition(filterCondition: any): Promise<T> {
        const doc: Document = await this.entity.findOne({
            where: filterCondition,
        });
        if (!doc) return null;
        return formatSingleResponse(doc);
    }

    async create(data: T): Promise<T> {
        const model = new this.entity(data);
        const doc: Document = await model.save(data);
        return formatSingleResponse(doc);
    }

    async update(filter: T, update: T): Promise<T> {
        return this.entity.findOneAndUpdate(filter, update);
    }

    async delete(data: T): Promise<DeleteResult> {
        return await this.entity.deleteMany(data);
    }
}
