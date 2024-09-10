/*
Add terms to your website or app that state how you plan to save payment method 
details and allow customers to opt in.

include a “Save my payment method for future use” checkbox to collect consent.

To charge them when they’re offline, make sure your terms include the following:

1. The customer’s agreement to your initiating a payment or a series of payments on 
their behalf for specified transactions.
2. The anticipated timing and frequency of payments (for example, if the charges 
are for scheduled installments, subscription payments, or unscheduled top-ups).
3. How you determine the payment amount.
4. Your cancellation policy, if the payment method is for a subscription service.

Make sure you keep a record of your customer’s written agreement to these terms.
*/

import { CreatePaymentMethod, DeletePaymentMethod } from './types'
import { UsersRepository } from '../../data/repositories/users.repository'
import { NotFoundException } from '@nestjs/common'
import { User } from '../../common/entities'
import { PaymentsClientService } from 'src/utils/payments-client/payments.client.service'
import {
    CreatePaymentCustomer,
    PaymentCustomer,
    PaymentIntent,
    PaymentMethod,
    PaymentMethodsList,
    PaymentMethodUpdateParams,
    SetupIntent,
} from '../../utils/payments-client/types'

export class PaymentsService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly paymentsClient: PaymentsClientService
    ) {}

    async createCustomer(
        data: CreatePaymentCustomer
    ): Promise<PaymentCustomer> {
        return await this.paymentsClient.createCustomer(data)
    }

    async setupIntent(userId: string): Promise<any> {
        let user: User = await this.usersRepository.getUserById(userId, {
            select: '-sessions -password',
        })

        if (!user) {
            throw new NotFoundException(
                `User with id ${userId} does not exist.`
            )
        }

        const { paymentCustomerId } = user
        const setupIntent: SetupIntent =
            await this.paymentsClient.createSetupIntent(paymentCustomerId)

        return { clientSecret: setupIntent.client_secret }
    }

    async deleteIntent(paymentId: string): Promise<any> {
        const canceledIntent: SetupIntent =
            await this.paymentsClient.deleteIntent(paymentId)
        return { canceledIntent }
    }

    async getPaymentMethods(paymentCustomerId: string): Promise<any> {
        const paymentMethods =
            await this.paymentsClient.getPaymentMethods(paymentCustomerId)
        console.log('Payment Methods', paymentMethods)
        return {
            paymentMethods: paymentMethods.data.sort(
                (a, b) => 0.5 - Math.random()
            ),
        }
    }

    async recordPaymentMethod(data: CreatePaymentMethod): Promise<any> {
        const user = await this.usersRepository.getUserById(data.userId)
        if (!user) {
            throw new NotFoundException(
                `User with id ${data.userId} does not exist.`
            )
        }
        const paymentMethod = await this.setDefaultPaymentMethod(
            data.paymentMethodId,
            data.defaultPaymentMethod
        )

        if (data.defaultPaymentMethod) {
            this.usersRepository.updateUserById(data.userId, {
                paymentSetup: true,
            })
        }
        return paymentMethod
    }

    async setDefaultPaymentMethod(
        paymentMethodId: string,
        defaultPaymentMethod: boolean = true
    ): Promise<{ paymentMethod: PaymentMethod }> {
        const updateParams: PaymentMethodUpdateParams = {
            metadata: { default: defaultPaymentMethod ? 'true' : 'false' },
        }
        const paymentMethod: PaymentMethod =
            await this.paymentsClient.updatePaymenMethod(
                paymentMethodId,
                updateParams
            )
        return { paymentMethod }
    }

    async changeDefaultPaymentMethod(
        paymentCustomerId: string,
        paymentMethodId: string
    ): Promise<any> {
        const oldDefaultPaymentMethod: PaymentMethod =
            await this.findDefaultPaymentMethod(paymentCustomerId)
        await this.setDefaultPaymentMethod(oldDefaultPaymentMethod.id, false)
        return await this.setDefaultPaymentMethod(paymentMethodId, true)
    }

    async deletePaymentMethod(data: DeletePaymentMethod): Promise<any> {
        this.paymentsClient.detachPaymentMethod(data.paymentMethodId)
        if (data.defaultPaymentMethod) {
            const paymentMethods = await this.paymentsClient.getPaymentMethods(
                data.paymentCustomerId
            )
            if (paymentMethods.data.length > 0) {
                let newDefaultPaymentMethodId = paymentMethods.data[0].id
                await this.setDefaultPaymentMethod(newDefaultPaymentMethodId)
                return { newDefaultPaymentMethodId }
            } else {
                await this.setNoDefaultPaymentMethod(data.userId)
                return { noPaymentSetup: true }
            }
        }
    }

    setNoDefaultPaymentMethod = async (userId: string) => {
        let user: User = await this.usersRepository.getUserById(userId, {
            select: '-sessions -password',
        })

        if (!user) {
            throw new NotFoundException(
                `User with id ${userId} does not exist.`
            )
        }

        this.usersRepository.updateUserById(userId, {
            paymentSetup: false,
        })
    }

    async findDefaultPaymentMethod(
        paymentCustomerId: string
    ): Promise<PaymentMethod> {
        const paymentMethods: PaymentMethodsList =
            await this.getPaymentMethods(paymentCustomerId)
        let defaultPaymentMethod
        ;(await paymentMethods).data.forEach((method: PaymentMethod) => {
            if (method.metadata.default === 'true')
                defaultPaymentMethod = method
        })
        return defaultPaymentMethod
    }

    async chargeUser(user: User, price): Promise<any> {
        let paymentMethod: PaymentMethod = await this.findDefaultPaymentMethod(
            user.paymentCustomerId
        )

        await this.paymentsClient.createPaymentIntent({
            customerId: user.paymentCustomerId,
            amount: Number(Number(price * 100).toFixed(0)),
            paymentMethodId: paymentMethod.id,
        })
    }
}
