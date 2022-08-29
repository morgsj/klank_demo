import { UID } from "../../../../api/types";
import React, { useEffect, useState } from "react";
import { useUserDetails } from "../../../../api/user-api";
import "./SidebarMessage.css";

interface SidebarMessageProps {
  other: UID;
  message: string;
  setSelected: (_: string) => void;
}
export default function SidebarMessage({ other, message, setSelected }: SidebarMessageProps) {
  const [userDetails, userDetailsLoading, userDetailsError] = useUserDetails(other);

  return (
    <>
      <div className="sidebar-message" onClick={() => setSelected(userDetails?.name!)}>
        <b>{userDetails?.name ?? other}</b>
        <br />
        {message ?? "Message not found"}
      </div>
    </>
  );
}