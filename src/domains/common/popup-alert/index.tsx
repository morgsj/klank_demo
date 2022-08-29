import React from "react";
import Alert from "react-bootstrap/Alert";

interface PopupAlertProps {
  variant: string
}
export function PopupAlert({ variant }: PopupAlertProps) {
  return (
      <Alert variant={variant}>Hiya</Alert>
  );
}