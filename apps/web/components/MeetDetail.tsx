"use client";

import {
  ChatSidebarAndPopup,
  MainMeetContent,
  MeetModalComponent,
  MeetPreviewModalComponent,
  MobileChatPopup,
} from "@amurex/ui/components";
import { useRef } from "react";

export const MeetDetail = ({
  styles,
  params,
}: {
  styles: {
    readonly [key: string]: string;
  };
  params: { id: string };
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <MeetModalComponent id={params.id} />

      <MeetPreviewModalComponent params={params} />

      <ChatSidebarAndPopup messagesEndRef={messagesEndRef} />

      <MobileChatPopup messagesEndRef={messagesEndRef} />

      <MainMeetContent params={params} styles={styles} />
    </>
  );
};
