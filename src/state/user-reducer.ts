type StateType = {
    age: number
    childrenCount: number
    name: string
}
type ActionType = {
    type: string
    [key: string]: any
}

const INCREMENT_AGE = 'INCREMENT-AGE'
const INCREMENT_CHILDREN_COUNT = 'INCREMENT-CHILDREN-COUNT'
const CHANGE_NAME = 'CHANGE-NAME'

export const userReducer = (state: StateType, action: ActionType) => {
    switch (action.type) {
        case INCREMENT_AGE:
            return {...state, age: state.age + 1};
        case INCREMENT_CHILDREN_COUNT:
            return {...state, childrenCount: state.childrenCount + 1};
        case 'CHANGE-NAME':
            return {...state, name: action.name}
        default:
            throw new Error("I don't understand this type")
    }
}

export const IncrementAgeAC = () => {
    return {
        type: INCREMENT_AGE
    }
}

export const IncrementChildrenCountAC = () => {
    return {
        type: INCREMENT_CHILDREN_COUNT
    }
}

export const ChangeNameAC = (name: string) => {
    return {
        type: CHANGE_NAME,
        name: name
    }
}

