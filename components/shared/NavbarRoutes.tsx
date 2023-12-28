"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");
  const isSearcherPage = pathname === "/search";
  return (
    <>
      {isSearcherPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Button size="sm" variant="ghost" asChild>
            <Link href="/">
              <LogOut className="size-4 mr-2" />
              Exit
            </Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant="ghost">
            <Link href="/teacher/courses">Teacher mode</Link>
          </Button>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
