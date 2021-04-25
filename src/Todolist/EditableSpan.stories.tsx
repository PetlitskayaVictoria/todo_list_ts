import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import {action} from "@storybook/addon-actions";
import EditableSpan, {EditableSpanType} from "./EditableSpan";

export default {
    title: 'TODOLIST/EditableSpan',
    component: EditableSpan,
    argTypes: {
        title: {
            defaultValue: "React1"
        }
    }
} as Meta;

const Template: Story<EditableSpanType> = (args) => <EditableSpan {...args} />;

export const EditableSpanStories = Template.bind({});
EditableSpanStories.args = {
    changeTitle: action("The title is changed")
};

export const EditableSpan2Stories = Template.bind({});
EditableSpan2Stories.args = {
    changeTitle: action("The title is changed")
};
