import { Injectable } from '@nestjs/common'
import { Constants } from '../constants'

@Injectable()
export class CalculatorService {
    constructor() {}

    calculateTotalTime = (startTime, stopTime) => {
        const timeInMiliseconds = stopTime - startTime
        const minutes = this.getMinutes(timeInMiliseconds)
        const seconds = this.getSeconds(timeInMiliseconds)
        return { minutes, seconds }
    }

    calculateTotalPrice = (totalTime) => {
        const totalPrice =
            1 +
            totalTime.minutes * Constants.regularRatePerMinute +
            (totalTime.seconds / 60) * Constants.regularRatePerMinute
        return totalPrice.toFixed(2)
    }

    getSeconds = (timerTime) => {
        return ('0' + (Math.floor(timerTime / 1000) % 60)).slice(-2)
    }
    getMinutes = (timerTime) => {
        return ('0' + (Math.floor(timerTime / 60000) % 60)).slice(-2)
    }
}
