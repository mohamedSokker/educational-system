"use client";

import { useQuery } from "@tanstack/react-query";

import { TeacherDashboardData } from "@/types/teacher-dashboard";

const fetchTeacherDashboardData = async (): Promise<TeacherDashboardData> => {
  const url = new URL("/api/teacher-dashboard", window.location.origin); // Adjust path accordingly
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

export const useTeacherDashboardData = () => {
  return useQuery<TeacherDashboardData, Error>({
    queryKey: ["teacher-dashboardData"],
    queryFn: () => fetchTeacherDashboardData(),
    enabled: true, // Set to false to control manually
  });
};
