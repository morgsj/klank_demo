import React from "react";
import BookingOutline from ".";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "BookingOutline",
  component: BookingOutline,
} as ComponentMeta<typeof BookingOutline>;

const Template: ComponentStory<typeof BookingOutline> = (args) => (
  <BookingOutline {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
