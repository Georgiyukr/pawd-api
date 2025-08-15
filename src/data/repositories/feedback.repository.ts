import { Injectable } from '@nestjs/common'
import { Feedback } from '../../common/entities'
import { DataServices } from '../data-services'

@Injectable()
export class FeedbackRepository {
    constructor(private dataServices: DataServices) {}

    async createFeedback(feedback: Feedback): Promise<Feedback> {
        return await this.dataServices.feedback.create(feedback)
    }

    async getFeedbackById(feedbackId: string): Promise<Feedback> {
        return await this.dataServices.feedback.getById(feedbackId)
    }
}
