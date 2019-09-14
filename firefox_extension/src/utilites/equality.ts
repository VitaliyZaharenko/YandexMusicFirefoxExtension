
export {
    ObjectEquality
}

interface ObjectEquality<T> {
    equalsTo(other: T): boolean
}