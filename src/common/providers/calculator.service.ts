import { Injectable } from '@nestjs/common'

@Injectable()
export class CalculatorService {
    constructor() {}

    calculateTotalTime = (startTime, stopTime) => {
        const timeInMiliseconds = stopTime - startTime
        const minutes = getMinutes(timeInMiliseconds)
        const seconds = getSeconds(timeInMiliseconds)
        return { minutes, seconds }
    }

    calculateTotalPrice = (totalTime) => {
        const totalPrice =
            totalTime.minutes * Rates.regular +
            (totalTime.seconds / 60) * Rates.regular
        return totalPrice.toFixed(2)
    }

    getSeconds = (timerTime) => {
        return ('0' + (Math.floor(timerTime / 1000) % 60)).slice(-2)
    }
    getMinutes = (timerTime) => {
        return ('0' + (Math.floor(timerTime / 60000) % 60)).slice(-2)
    }
}
