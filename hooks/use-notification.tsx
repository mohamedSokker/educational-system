"use client";

import { useQuery } from "@tanstack/react-query";

import { Notification } from "@prisma/client";

interface NotificationProps {
  notifications: Notification[];
}

const fetchNotificationsData = async (): Promise<NotificationProps> => {
  const url = new URL("/api/notifications", window.location.origin); // Adjust path accordingly
  console.log(url.toString());

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};

export const useNotificationsData = () => {
  return useQuery<NotificationProps, Error>({
    queryKey: ["notifications"],
    queryFn: () => fetchNotificationsData(),
    enabled: true, // Set to false to control manually
  });
};
