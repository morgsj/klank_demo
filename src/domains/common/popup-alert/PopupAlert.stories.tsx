import React from "react";
import { PopupAlert as PopupAlertComponent } from ".";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "PopupAlert",
  component: PopupAlertComponent,
} as ComponentMeta<typeof PopupAlertComponent>;

const Template: ComponentStory<typeof PopupAlertComponent> = (args) => (
  <PopupAlertComponent {...args} />
);

export const PopupAlert = Template.bind({});

PopupAlert.args = {
  variant: "danger"
};
