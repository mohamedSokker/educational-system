"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminDashboardData } from "@/types/admin-dashboard";

const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const url = new URL("/api/admin-dashboard", window.location.origin); // Adjust path accordingly
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

export const useAdminDashboardData = () => {
  return useQuery<AdminDashboardData, Error>({
    queryKey: ["admin-dashboardData"],
    queryFn: () => fetchAdminDashboardData(),
    enabled: true, // Set to false to control manually
  });
};
