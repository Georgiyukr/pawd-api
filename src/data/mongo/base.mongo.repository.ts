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

    buildQuery(
        query: Mongoose.Query<any, any>,
        options?: BaseMongoQueryOptions
    ) {
        if (options?.where) query = query.where(options.where)
        if (options?.populate) query = query.populate(options.populate)
        if (options?.select) query = query.select(options.select)
        if (options?.sort) query = query.sort(options.sort)
        console.log(query)
        return query
    }

    async getAll(options?: BaseMongoQueryOptions): Promise<T[]> {
        let query = this.entity.find()
        query = this.buildQuery(query, options)
        return (await query) as T[]
    }

    async get(filter: any, options?: BaseMongoQueryOptions): Promise<T> {
        let query = this.entity.findOne(filter)
        query = this.buildQuery(query, options)
        const doc: Document = (await query) as Document
        if (!doc) return null
        return doc as T
    }

    async getById(id: string, options?: BaseMongoQueryOptions): Promise<T> {
        const _id = new Mongoose.Types.ObjectId(id)
        let query = this.entity.findById(_id)
        query = this.buildQuery(query, options)
        const doc: Document = (await query) as Document
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
