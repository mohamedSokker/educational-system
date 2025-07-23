import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  header: string;
  label: string;
}

export const Header = ({ label, header }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-start justify-center">
      <h1 className="text-xl font-bold">{header}</h1>
      <p className="text-muted-foreground text-[16px]">{label}</p>
    </div>
  );
};

export default Header;
