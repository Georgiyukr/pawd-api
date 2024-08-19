import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { Config } from '../../utils/config'

describe('PaymentsController', () => {
    let controller: PaymentsController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [PaymentsService, Config],
        }).compile()

        controller = module.get<PaymentsController>(PaymentsController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
