import { Document, FilterQuery, Model, Query } from "mongoose";
import { BaseRepositoryInterface } from "../base.interface.repository";
import { BaseMongoQueryOptions, DeleteResult } from "./types";
import {
    formatSingleResponse,
    formatSingleResponseWithNoPassword,
} from "./formatters";

interface BaseMongoRepositoryInterface<T> extends BaseRepositoryInterface<T> {}

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

    async get(filter: any, options?: BaseMongoQueryOptions): Promise<T> {
        const doc: Document = options
            ? ((await this.entity
                  .findOne(filter)
                  .populate(options.populate)
                  .select(options.select)) as Document)
            : ((await this.entity.findOne(filter)) as Document);
        if (!doc) return null;
        return formatSingleResponse(doc);
    }

    async getById(id: string, options?: BaseMongoQueryOptions): Promise<T> {
        const doc: Document = options
            ? ((await this.entity
                  .findById(id)
                  .populate(options.populate)
                  .select(options.select)) as Document)
            : ((await this.entity.findById(id)) as Document);
        if (!doc) return null;
        return formatSingleResponse(doc);
    }

    async create(data: T): Promise<T> {
        const model = new this.entity(data);
        const doc: Document = await model.save(data);
        return formatSingleResponseWithNoPassword(doc);
    }

    async update(filter: T, update: T): Promise<T> {
        const doc: Document = await this.entity.findOneAndUpdate(
            filter,
            update,
            { new: true }
        );
        return formatSingleResponseWithNoPassword(doc);
    }

    async delete(data: T): Promise<DeleteResult> {
        return await this.entity.deleteMany(data);
    }
}
