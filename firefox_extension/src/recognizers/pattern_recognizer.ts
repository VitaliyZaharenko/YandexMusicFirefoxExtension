
import {
    ObjectEquality
} from '../utilites'

export  {
    PatternRecognizerState,
    PatternRecognizerInterface,
    TimedEvent,
    DoubleEventRecognizer,
    SingleEventRecognizer
}

enum PatternRecognizerState {
    Initial,
    Possible,
    Failed,
    Successed
}

interface PatternRecognizerInterface<T extends ObjectEquality<T>> {

    currentState: PatternRecognizerState

    consumeEntity(entity: T):boolean

    onFailed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void
    onSuccessed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void
    onPossible: (recognizer: PatternRecognizerInterface<T>, reason: T) => void
}

interface TimedEvent<T> {
    date: Date
    content: T
}

class DoubleEventRecognizer<T extends ObjectEquality<T>> implements PatternRecognizerInterface<T> {

    currentState: PatternRecognizerState = PatternRecognizerState.Initial;

    constructor(public timeoutMilliseconds: number = 1000) {} 

    private previousEvent: TimedEvent<T> | null = null


    consumeEntity(entity: T): boolean {
        let event: TimedEvent<T> = {
            date: new Date(),
            content: entity
        }
        if (this.previousEvent == null ) {
            this.recognizerPossible(event)
            return true
        } 
        let timeDifference = event.date.getTime() - this.previousEvent.date.getTime()
        let prevAfterCurrent: boolean = this.previousEvent.date.getTime() > event.date.getTime()
        let differenceBiggerThenTimeout: boolean = timeDifference >= this.timeoutMilliseconds
        let entitiesNotSame: boolean = event.content.equalsTo(this.previousEvent.content)
        if (prevAfterCurrent || differenceBiggerThenTimeout || entitiesNotSame) {
            this.recognizerFailed(entity)
            return true
        }

        this.recognizerSuccessed(entity)
        return true

    }

    private recognizerPossible(event: TimedEvent<T>) {
        this.currentState = PatternRecognizerState.Possible
        this.previousEvent = event
        if(this.onPossible != null) {
            this.onPossible(this, event.content)
            }
        setTimeout(this.timeout.bind(this), this.timeoutMilliseconds)
    }

    private recognizerFailed(entity: T) {
        this.currentState = PatternRecognizerState.Failed
        if(this.onFailed != null) {
            this.onFailed(this, entity)
        }
        this.previousEvent = null
    }

    private recognizerSuccessed(entity: T) {
        this.currentState = PatternRecognizerState.Successed
        if (this.onSuccessed) {
            this.onSuccessed(this, entity)
        }
        if (this.onDoubleEvent) {
            this.onDoubleEvent(this, entity)
        }
        this.previousEvent = null
    }

    private timeout() {
        if (this.currentState == PatternRecognizerState.Possible) {
            this.recognizerFailed(this.previousEvent.content)       
        }
    }

    onFailed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null
    onSuccessed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null
    onPossible: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null

    onDoubleEvent: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null

    
}

class SingleEventRecognizer<T extends ObjectEquality<T>> implements PatternRecognizerInterface<T> {
    currentState: PatternRecognizerState;

    constructor(public requireToFail: PatternRecognizerInterface<T> | null) {
        if(requireToFail) {
            requireToFail.onFailed = (recognizer, reason) => {
                this.recognizerSuccessed(reason)
            }
        }
    }

    consumeEntity(entity: T): boolean {

        let noDependentRecognizer = this.requireToFail == null
        let dependentRecognizerFailed = noDependentRecognizer
        if (!noDependentRecognizer) {
            this.requireToFail.consumeEntity(entity)
            dependentRecognizerFailed = this.requireToFail.currentState == PatternRecognizerState.Failed
        } 
        
        if(dependentRecognizerFailed || noDependentRecognizer) {
            this.recognizerSuccessed(entity)
            return true
        }
        let dependentRecognizerPossible = this.requireToFail.currentState == PatternRecognizerState.Possible
        if(dependentRecognizerPossible) {
            this.recognizerPossible(entity)
            return true
        }

        this.recognizerFailed(entity)
        return true
    }

    private recognizerSuccessed(entity) {
        this.currentState = PatternRecognizerState.Successed
        if(this.onSuccessed) { this.onSuccessed(this, entity) }
        if(this.onSingleEvent) { this.onSingleEvent(this, entity) }
    }
    private recognizerFailed(entity) {
        this.currentState = PatternRecognizerState.Failed
        if(this.onFailed) {
            this.onFailed(this, entity)
        }
    }
    private recognizerPossible(entity) {
        this.currentState = PatternRecognizerState.Possible
        if(this.onPossible) {
            this.onPossible(this, entity)
        }
    }

    onFailed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null
    onSuccessed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null
    onPossible: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null

    onSingleEvent: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null

}