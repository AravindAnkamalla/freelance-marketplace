"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { SignOutButton } from "@clerk/nextjs";


export default function ClientNavigationBar() {
  return (
    <div className="container mx-auto p-8">
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-8">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/client/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/client/jobs/post" className="hover:underline">
                Post a Job
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/client/dashboard/my-jobs" className="hover:underline">
                My Jobs
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/client/profile" className="hover:underline">
                Profile
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <SignOutButton>
              <NavigationMenuLink asChild>
                <span className="cursor-pointer hover:underline">
                  Sign Out
                </span>
              </NavigationMenuLink>
            </SignOutButton>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
