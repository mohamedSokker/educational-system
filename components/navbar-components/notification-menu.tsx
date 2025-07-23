"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircleIcon, BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSocket } from "@/hooks/useSocket";
// import { useNotificationsData } from "@/hooks/use-notification";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { format } from "date-fns";
import axios from "axios";
import { Notification } from "@prisma/client";

export interface NotificationProps {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp?: string;
  unread: boolean;
  createdAt: Date;
}

const initialNotifications: NotificationProps[] = [
  // {
  //   id: 1,
  //   user: "Chris Tompson",
  //   action: "requested review on",
  //   target: "PR #42: Feature implementation",
  //   timestamp: "15 minutes ago",
  //   unread: true,
  // },
  // {
  //   id: 2,
  //   user: "Emma Davis",
  //   action: "shared",
  //   target: "New component library",
  //   timestamp: "45 minutes ago",
  //   unread: true,
  // },
  // {
  //   id: 3,
  //   user: "James Wilson",
  //   action: "assigned you to",
  //   target: "API integration task",
  //   timestamp: "4 hours ago",
  //   unread: false,
  // },
  // {
  //   id: 4,
  //   user: "Alex Morgan",
  //   action: "replied to your comment in",
  //   target: "Authentication flow",
  //   timestamp: "12 hours ago",
  //   unread: false,
  // },
  // {
  //   id: 5,
  //   user: "Sarah Chen",
  //   action: "commented on",
  //   target: "Dashboard redesign",
  //   timestamp: "2 days ago",
  //   unread: false,
  // },
  // {
  //   id: 6,
  //   user: "Miky Derya",
  //   action: "mentioned you in",
  //   target: "Origin UI open graph image",
  //   timestamp: "2 weeks ago",
  //   unread: false,
  // },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

const formatNotificatinData = (date: Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHrs = Math.floor(diffMins / 60);
  return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
};

export default function NotificationMenu() {
  // const { data, isError, error } = useNotificationsData();
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const getNotifications = async () => {
    const response = await axios.post<{ notifications: Notification[] }>(
      `/api/notifications`
    );
    const formattedNot: NotificationProps[] = [];
    response?.data?.notifications?.forEach((notification, i) => {
      formattedNot.push({
        id: i,
        user: "",
        action: notification.action,
        target: notification.target,
        timestamp: "",
        unread: notification.unread,
        createdAt: notification.createdAt,
      });
    });
    setNotifications(formattedNot);
  };

  const updateNotificationTimestamps = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        timestamp: formatNotificatinData(new Date(notification.createdAt)),
      }))
    );
  }, []);

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateNotificationTimestamps();
    }, 60000);

    return () => clearInterval(interval);
  }, [updateNotificationTimestamps]);

  // if (isError || !data)
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <Alert variant="destructive" className="max-w-[600px]">
  //         <AlertCircleIcon />
  //         <AlertTitle>Unable to Fetch Data.</AlertTitle>
  //         <AlertDescription>
  //           <p>Please verify you are Connecting to internet and try again.</p>
  //           <ul className="list-inside list-disc text-sm">
  //             <li>Check your internet connection</li>
  //             <li>Contact support for server issues</li>
  //             <li>{error?.message}</li>
  //           </ul>
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   );

  // useEffect(() => {
  //   const formattedNot: NotificationProps[] = [];
  //   data?.notifications.forEach((notification, i) => {
  //     formattedNot.push({
  //       id: i,
  //       user: "",
  //       action: notification.action,
  //       target: notification.target,
  //       timestamp: formatNotificatinData(notification.createdAt),
  //       unread: notification.unread,
  //     });
  //   });
  //   setNotifications(formattedNot);
  // }, [data]);

  // const { messages, isConnected, sendMessage } = useSocket();
  // console.log(messages);

  // const handleSend = () => {
  //   const payload = {
  //     type: "chat",
  //     content: "Hello world!",
  //     user: "mohamed sokker",
  //     timestamp: new Date().toISOString(),
  //   };
  //   console.log(`Payload ${JSON.stringify(payload)}`);

  //   sendMessage(payload);
  // };

  // useEffect(() => {
  //   handleSend();
  // }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  return (
    <Popover onOpenChange={(open) => open && updateNotificationTimestamps()}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground relative size-8 rounded-full shadow-none"
          aria-label="Open notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="bg-primary absolute top-0.5 right-0.5 size-1 rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-foreground/80 text-left after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <span className="text-foreground font-medium hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="text-foreground font-medium hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-muted-foreground text-xs">
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
