"use client";

import { useQuery } from "@tanstack/react-query";

import { StudentDashboardData } from "@/types/student-dashboard";

const fetchStudentDashboardData = async (): Promise<StudentDashboardData> => {
  const url = new URL("/api/student-dashboard", window.location.origin); // Adjust path accordingly
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

export const useStudentDashboardData = () => {
  return useQuery<StudentDashboardData, Error>({
    queryKey: ["student-dashboardData"],
    queryFn: () => fetchStudentDashboardData(),
    enabled: true, // Set to false to control manually
  });
};
