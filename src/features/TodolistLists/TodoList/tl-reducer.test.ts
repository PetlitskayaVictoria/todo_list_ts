import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, TodolistDomainType,
    todoListReducer
} from './tl-reducer'
import {v1} from 'uuid';


let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id : todolistId1, title : "What to learn", addedDate: '', order: 0, filter : "all"},
        {id : todolistId2, title : "What to buy", addedDate: '', order: 0, filter : "all"}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todoListReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let newTodoList = {
        id: v1(),
        addedDate: '',
        order: 0,
        title: "New Todolist"
    }

    const endState = todoListReducer(startState, addTodolistAC(newTodoList))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodoList.title);
    expect(startState === endState).toBeFalsy()
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist";

    const endState = todoListReducer(startState, changeTodolistTitleAC(newTodolistTitle, todolistId2));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todoListReducer(startState, changeFilterAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});





