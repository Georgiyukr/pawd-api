import { Document, Model } from 'mongoose'
import * as Mongoose from 'mongoose'
import { BaseRepositoryInterface } from '../base.interface.repository'
import { BaseMongoQueryOptions, DeleteResult } from './types'

interface BaseMongoRepositoryInterface<T> extends BaseRepositoryInterface<T> {}

export class BaseMongoRepository<T> implements BaseMongoRepositoryInterface<T> {
    private entity: Model<T>
    constructor(entity: Model<T>) {
        this.entity = entity
    }

    async getAll(options?: BaseMongoQueryOptions): Promise<T[]> {
        const doc = options
            ? await this.entity
                  .find()
                  .where(options.where)
                  .populate(options.populate)
                  .select(options.select)
                  .sort(options.sort)
            : await this.entity.find()
        return doc
    }

    async get(filter: any, options?: BaseMongoQueryOptions): Promise<T> {
        const doc: Document = options
            ? ((await this.entity
                  .findOne(filter)
                  .populate(options.populate)
                  .select(options.select)) as Document)
            : ((await this.entity.findOne(filter)) as Document)
        if (!doc) return null
        return doc as T
    }

    async getById(id: string, options?: BaseMongoQueryOptions): Promise<T> {
        const _id = new Mongoose.Types.ObjectId(id)
        const doc: Document = options
            ? ((await this.entity
                  .findById(_id)
                  .populate(options.populate)
                  .select(options.select)) as Document)
            : ((await this.entity.findById(id)) as Document)
        if (!doc) return null
        return doc as T
    }

    async create(data: T): Promise<T> {
        const model = new this.entity(data)
        const doc: Document = await model.save(data)
        return doc as T
    }

    async update(
        filter: Record<string, T>,
        update: Record<string, T>
    ): Promise<T> {
        const doc: Document = await this.entity.findOneAndUpdate(
            filter,
            update,
            { new: true }
        )
        return doc as T
    }

    async updateById(id: string, update: T): Promise<T> {
        const _id = new Mongoose.Types.ObjectId(id)
        const doc: Document = await this.entity.findOneAndUpdate(
            { _id },
            update,
            { new: true }
        )
        return doc as T
    }

    async delete(data: T): Promise<DeleteResult> {
        return await this.entity.deleteMany(data)
    }

    async deleteById(id: string, options: Mongoose.QueryOptions): Promise<T> {
        const _id = new Mongoose.Types.ObjectId(id)
        return await this.entity.findByIdAndRemove(_id, options)
    }
}
