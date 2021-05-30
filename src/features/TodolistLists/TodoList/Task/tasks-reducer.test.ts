import {
    addTaskAC,
    removeTaskAC,
    tasksReducer, TaskStateType,
    updateTaskAC
} from './tasks-reducer';

import {addTodolistAC} from "../tl-reducer";
import {TaskPriorities, TaskStatuses} from "../../../../api/todolist-api";
import {v1} from "uuid";

let startState: TaskStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, description: '', todoListId: "todolistId1", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
            { id: "2", title: "JS", status: TaskStatuses.Completed, description: '', todoListId: "todolistId1", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
            { id: "3", title: "React", status: TaskStatuses.New, description: '', todoListId: "todolistId1", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, description: '', todoListId: "todolistId2", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
            { id: "2", title: "milk", status: TaskStatuses.Completed, description: '', todoListId: "todolistId2", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
            { id: "3", title: "tea", status: TaskStatuses.New, description: '', todoListId: "todolistId2", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
        ]
    };
})


test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC({taskId: "2", todoListId: "todolistId2"});

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, description: '', todoListId: "todolistId1", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
            { id: "2", title: "JS", status: TaskStatuses.Completed, description: '', todoListId: "todolistId1", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
            { id: "3", title: "React", status: TaskStatuses.New, description: '', todoListId: "todolistId1", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, description: '', todoListId: "todolistId2", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" },
            { id: "3", title: "tea", status: TaskStatuses.New, description: '', todoListId: "todolistId2", order: 0, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: '', entityStatus: "idle" }
        ]
    });

});

test('correct task should be added to correct array', () => {
    const task = {
        id: v1(),
        title: "coffee",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        addedDate: ""
    }

    const action = addTaskAC({task});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("coffee");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC({taskId: "2", domainModel: {status: TaskStatuses.New}, todoListId: "todolistId2"
});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
});

test('title of specified task should be changed', () => {

    const action = updateTaskAC({taskId: "2", domainModel: {title: "beer"}, todoListId: "todolistId2"
});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("beer");
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {
    const newTodoList = {
        id: v1(),
        addedDate: "",
        order: 0,
        title: "new todolist"
    }
    const action = addTodolistAC({todoList: newTodoList});

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});



