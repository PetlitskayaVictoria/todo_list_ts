import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import Task, {TaskPropsType} from "./Task";
import {ReduxStoreProviderDecorator} from "../../stories/decorators/ReduxStoreProviderDecorator";
import {TaskStatuses} from "../../api/todolist-api";

export default {
    title: 'TODOLIST/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
} as Meta;

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

export const TaskIsDoneStories = Template.bind({});
TaskIsDoneStories.args = {
    id: "qqqq",
    todoListId: "ddddd",
    title: "Buy a book",
    status: TaskStatuses.Completed
};

export const TaskIsActiveStories = Template.bind({});
TaskIsActiveStories.args = {
    id: "qqqq",
    todoListId: "ddddd",
    title: "Buy some food",
    status: TaskStatuses.New
};


