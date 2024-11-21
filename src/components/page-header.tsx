import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface AppHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  showSidebarTrigger?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({
  breadcrumbs,
  showSidebarTrigger = true,
  children,
}: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:border-gray-800">
      <div className="flex items-center gap-2">
        {showSidebarTrigger && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </>
        )}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
                <BreadcrumbItem
                  className={
                    index < breadcrumbs.length - 1
                      ? "hidden capitalize md:block"
                      : ""
                  }
                >
                  {item.href ? (
                    <BreadcrumbLink className="capitalize" href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="capitalize">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {children && (
        <div className="ml-auto flex items-center px-4">{children}</div>
      )}
    </header>
  );
}
