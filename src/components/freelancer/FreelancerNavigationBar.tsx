"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { SignOutButton } from "@clerk/nextjs";


export default function FreelancerNavigationBar() {
  return (
    <div className="container mx-auto p-8">
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-8">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/freelancer/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/freelancer/dashbaord/my-applications" className="hover:underline">
               My Applications
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/freelancer/dashboard/recommended-jobs" className="hover:underline">
                Recommended Jobs
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/freelancer/profile" className="hover:underline">
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
