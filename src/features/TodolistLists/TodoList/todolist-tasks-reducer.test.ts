
import {addTodolistAC, removeTodolistAC, TodolistDomainType, todoListReducer} from "./tl-reducer";
import {tasksReducer, TaskStateType} from "./Task/tasks-reducer";
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
    const action = addTodolistAC({todoList: newTodoList});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListReducer(startTodolistsState, action)
    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todoList.id);
    expect(idFromTodolists).toBe(action.payload.todoList.id);
});

test('property with todolistId should be deleted', () => {
    const startState: TaskStateType = {
        "todolistId1": [
            {id: "1", title: "CSS", description: "", todoListId: "todolistId1", order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: "", entityStatus: "idle"},
            {id: "2", title: "JS", description: "", todoListId: "todolistId1", order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: "", entityStatus: "idle"},
            {id: "3", title: "React", description: "", todoListId: "todolistId1", order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: "", entityStatus: "idle"}
        ],
        "todolistId2": [
            {id: "1", title: "bread", description: "", todoListId: "todolistId2", order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: "", entityStatus: "idle"},
            {id: "2", title: "milk", description: "", todoListId: "todolistId2", order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: "", entityStatus: "idle"},
            {id: "3", title: "tea", description: "", todoListId: "todolistId2", order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: "", deadline: "", addedDate: "", entityStatus: "idle"}
        ]
    };

    const action = removeTodolistAC({todolistId: "todolistId2"});
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

