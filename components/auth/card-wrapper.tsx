"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import Header from "./header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  headerHead: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  headerHead,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="md:w-[500px] lg:w-[500px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} header={headerHead} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};
