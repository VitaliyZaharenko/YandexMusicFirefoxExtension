

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

interface PatternRecognizerInterface<T> {

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


class DoubleEventRecognizer<T> implements PatternRecognizerInterface<T> {

    currentState: PatternRecognizerState = PatternRecognizerState.Initial;

    constructor(public timeoutMilliseconds: number = 1000) {} 

    private previousEvent: TimedEvent<T> | null = null


    consumeEntity(entity: T): boolean {
        let event: TimedEvent<T> = {
            date: new Date(),
            content: entity
        }
        
        if (this.previousEvent == null ) {
            this.currentState = PatternRecognizerState.Possible
            this.previousEvent = event
            if(this.onPossible != null) {
                this.onPossible(this, entity)
            }
            return true
        } 

        let timeDifference = event.date.getTime() - this.previousEvent.date.getTime()

        let prevAfterCurrent: boolean = this.previousEvent.date.getTime() > event.date.getTime()
        let differenceBiggerThenTimeout: boolean = timeDifference >= this.timeoutMilliseconds
        let entitiesNotSame: boolean = event.content != this.previousEvent.content

        if (prevAfterCurrent || differenceBiggerThenTimeout || entitiesNotSame) {
            this.currentState = PatternRecognizerState.Failed
            if(this.onFailed != null) {
                this.onFailed(this, entity)
            }
            this.previousEvent = null
            return
        }
        
        this.currentState = PatternRecognizerState.Successed
        if (this.onSuccessed) {
            this.onSuccessed(this, entity)
        }
        if (this.onDoubleEvent) {
            this.onDoubleEvent(this, entity)
        }
        this.previousEvent = null
    }

    onFailed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null
    onSuccessed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null
    onPossible: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null

    onDoubleEvent: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null

    
}

class SingleEventRecognizer<T> implements PatternRecognizerInterface<T> {
    currentState: PatternRecognizerState;

    constructor(public requireToFail: PatternRecognizerInterface<T> | null) {}

    consumeEntity(entity: T): boolean {

        let noDependentRecognizer = this.requireToFail == null
        let dependentRecognizerFailed = noDependentRecognizer
        if (!noDependentRecognizer) {
            this.requireToFail.consumeEntity(entity)
            dependentRecognizerFailed = this.requireToFail.currentState == PatternRecognizerState.Failed
        } 
        
        if(dependentRecognizerFailed || noDependentRecognizer) {
            this.currentState = PatternRecognizerState.Successed
            if(this.onSuccessed) { this.onSuccessed(this, entity) }
            if(this.onSingleEvent) { this.onSingleEvent(this, entity) }
        }

        this.currentState = PatternRecognizerState.Failed
        if(this.onFailed) {
            this.onFailed(this, entity)
        }
        return true
    }

    onFailed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null
    onSuccessed: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null
    onPossible: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null

    onSingleEvent: (recognizer: PatternRecognizerInterface<T>, reason: T) => void = null

}