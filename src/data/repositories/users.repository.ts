import { Injectable } from '@nestjs/common'
import { User } from '../../common/entities'
import { DataServices } from '../data-services'

@Injectable()
export class UsersRepository {
    constructor(private dataServices: DataServices) {}

    async createUser(user: User): Promise<User> {
        return await this.dataServices.users.create(user)
    }

    async updateUser(filter, update): Promise<User> {
        return await this.dataServices.users.update(filter, update)
    }

    async updateUserById(id, update): Promise<User> {
        return await this.dataServices.users.updateById(id, update)
    }

    async getUserByEmail(
        email: Lowercase<string>,
        options = undefined
    ): Promise<User> {
        return await this.dataServices.users.get({ email }, options)
    }

    async getUserById(id: string, options = undefined): Promise<User> {
        return this.dataServices.users.getById(id, options)
    }
}
