import {ChangeNameAC, IncrementAgeAC, IncrementChildrenCountAC, userReducer} from './user-reducer';

test('user reducer should increment only age', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };

    const endState = userReducer(startState, IncrementAgeAC())

    expect(endState.age).toBe(21);
    expect(endState.childrenCount).toBe(2);
});

test('user reducer should increment only childrenCount', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };

    const endState = userReducer(startState, IncrementChildrenCountAC());

    expect(endState.childrenCount).toBe(3);
    expect(endState.age).toBe(20);
});

test('user reducer should change name', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };

    const endState = userReducer(startState, ChangeNameAC("Victoria"));

    expect(endState.name).toBe("Victoria")
    expect(startState.name).toBe("Dimych")
});
