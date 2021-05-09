import {TaskStateType} from "../../../app/App";
import {addTodolistAC, removeTodolistAC, TodolistDomainType, todoListReducer} from "./tl-reducer";
import {tasksReducer} from "./Task/tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../../../api/todolist-api";


test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];
    const newTodoList = {
        id: "5",
        addedDate: "",
        order: 0,
        title: "new todolist"
    }
    const action = addTodolistAC(newTodoList);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListReducer(startTodolistsState, action)
    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todoList.id);
    expect(idFromTodolists).toBe(action.todoList.id);
});

test('property with todolistId should be deleted', () => {
    const startState: TaskStateType = {
        "todolistId1": [
            {id: "1", title: "CSS", description: "", todoListId: "todolistId1", order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: ""},
            {id: "2", title: "JS", description: "", todoListId: "todolistId1", order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: ""},
            {id: "3", title: "React", description: "", todoListId: "todolistId1", order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: ""}
        ],
        "todolistId2": [
            {id: "1", title: "bread", description: "", todoListId: "todolistId2", order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: ""},
            {id: "2", title: "milk", description: "", todoListId: "todolistId2", order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: ""},
            {id: "3", title: "tea", description: "", todoListId: "todolistId2", order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: ""}
        ]
    };

    const action = removeTodolistAC("todolistId2");
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

