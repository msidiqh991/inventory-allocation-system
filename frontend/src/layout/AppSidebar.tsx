"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Grid, Package, MoreHorizontal } from "@deemlol/next-icons";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { icon: <Grid />, name: "Dashboard", path: "/" },
  { icon: <Package />, name: "Purchase Requests", path: "/purchase-request" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const isWide = isExpanded || isHovered || isMobileOpen;

  const isActive = (path: string) => pathname === path;

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.path}
      className={`menu-item group ${
        isActive(item.path) ? "menu-item-active" : "menu-item-inactive"
      } ${!isWide ? "lg:justify-center" : "lg:justify-start"}`}
      aria-current={isActive(item.path) ? "page" : undefined}
    >
      <span
        className={`${
          isActive(item.path)
            ? "menu-item-icon-active"
            : "menu-item-icon-inactive"
        }`}
      >
        {item.icon}
      </span>
      {isWide && <span className="menu-item-text">{item.name}</span>}
    </Link>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isWide ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Main sidebar"
    >
      <div className="py-8 flex justify-center">
        <Link href="/" aria-label="Go to Home">
          {isWide ? (
            <Image
              className="dark:hidden"
              src="/images/logo/brand-logo-1.webp"
              alt="Logo"
              width={100}
              height={40}
              priority
            />
          ) : (
            <Image
              src="/images/logo/brand-logo-1.webp"
              alt="Logo"
              width={52}
              height={52}
              priority
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6" aria-label="Primary navigation">
          <h2
            className={`mb-4 text-xs uppercase flex text-gray-400 ${
              !isWide ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isWide ? "Menu" : <MoreHorizontal />}
          </h2>
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;