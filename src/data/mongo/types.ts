import { FilterQuery, PopulateOptions } from 'mongoose'

type SelectOptions =
    | string
    | string[]
    | Record<string, number | boolean | object>

export declare interface DeleteResult {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined. */
    acknowledged: boolean
    /** The number of documents that were deleted */
    deletedCount: number
}

export type BaseMongoQueryOptions = {
    populate?: PopulateOptions
    select?: SelectOptions
    where?: FilterQuery<any>
    sort?: Record<string, 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'>
}
