"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface StudentProps {
  certificateId: string;
}

const CertificateBtn = ({ certificateId }: StudentProps) => {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      onClick={() => router.push(`/student/view-certificates/${certificateId}`)}
    >
      <ArrowRight />
    </Button>
  );
};

export default CertificateBtn;
