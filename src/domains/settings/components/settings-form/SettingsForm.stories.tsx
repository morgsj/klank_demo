import React from "react";
import { SettingsForm as SettingsFormComponent } from "./SettingsForm";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "SettingsForm",
  component: SettingsFormComponent,
} as ComponentMeta<typeof SettingsFormComponent>;

const Template: ComponentStory<typeof SettingsFormComponent> = (args) => (
  <SettingsFormComponent {...args} />
);

export const SettingsForm = Template.bind({});

SettingsForm.args = {};
