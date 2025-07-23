// hooks/useSocket.ts
"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export interface MessagePayload {
  id: string;
  user: string;
  target: string;
  action?: string;
  timestamp: string;
  unread: string;
}

export const useSocket = () => {
  const socketRef = useRef<typeof Socket | null>(null);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Prevent multiple connections
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleMessage = (data: MessagePayload) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("EdumeRecNot", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("EdumeRecNot", handleMessage);
      socket.disconnect();
    };
  }, []);

  const sendMessage = (payload: MessagePayload) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("EdumeNot", payload);
    }
  };

  return { messages, isConnected, sendMessage };
};
