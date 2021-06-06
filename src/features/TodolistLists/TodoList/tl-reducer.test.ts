import {
    changeFilterAC, changeTodolistTitleTC,
    createTodoListTC, deleteTodoListTC, FilterValuesType,
    TodolistDomainType,
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
        {id : todolistId1, title : "What to learn", addedDate: '', order: 0, filter : "all", entityStatus: "idle"},
        {id : todolistId2, title : "What to buy", addedDate: '', order: 0, filter : "all", entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todoListReducer(startState, deleteTodoListTC.fulfilled({todolistId: todolistId1}, "", todolistId1))

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

    const endState = todoListReducer(startState, createTodoListTC.fulfilled({todoList: newTodoList}, "", newTodoList.title))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodoList.title);
    expect(startState === endState).toBeFalsy()
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist";

    const endState = todoListReducer(startState, changeTodolistTitleTC.fulfilled({title: newTodolistTitle, id: todolistId2}, "", {todoListId: todolistId2, title: newTodolistTitle}));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todoListReducer(startState, changeFilterAC({id: todolistId2, newValue: newFilter}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});





