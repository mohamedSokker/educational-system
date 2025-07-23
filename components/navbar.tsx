import InfoMenu from "@/components/navbar-components/info-menu";
import Logo from "@/components/navbar-components/logo";
import NotificationMenu from "@/components/navbar-components/notification-menu";
import UserMenu from "@/components/navbar-components/user-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./theme-toggle";
import { auth } from "@/auth";
import { Badge } from "./ui/badge";
import { LandmarkIcon } from "lucide-react";

// Navigation links array to be used in both desktop and mobile menus
// const navigationLinks = [
//   { href: "#", label: "Dashboard" },
//   { href: "#", label: "Features" },
//   { href: "#", label: "Pricing" },
//   { href: "#", label: "About" },
// ];

export default async function Navbar() {
  const session = await auth();
  const navigationLinks =
    session?.user.role === "Admin"
      ? [
          { href: "/", label: "Dashboard" },
          { href: "/grades", label: "Grades" },
          { href: "/subjects", label: "Subjects" },
          { href: "/teachers", label: "Teachers" },
          { href: "/students", label: "Students" },
          { href: "/classes", label: "Classes" },
          { href: "/user-roles", label: "Users" },
        ]
      : // : session?.user.role === "Teacher"
        // ? [{ href: "/", label: "Dashboard" }]
        // : session?.user.role === "Student"
        // ? [{ href: "/", label: "Dashboard" }]
        [];
  return (
    <header className="border-b px-4 md:px-6 w-full sticky top-0">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink href={link.href} className="py-1.5">
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a href="/" className="text-primary hover:text-primary/90">
              <LandmarkIcon className="w-6 h-6" />
              {/* <Logo /> */}
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Theme */}
            <ModeToggle />
            {/* Notification */}
            <NotificationMenu />
          </div>
          {/* User menu */}
          <UserMenu />
          {/* <UserButton /> */}
          {session?.user.role && (
            <Badge variant="secondary">{session?.user.role}</Badge>
          )}
        </div>
      </div>
    </header>
  );
}
