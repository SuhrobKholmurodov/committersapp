import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
    <ol className="flex flex-wrap items-center gap-1 text-gray-500 dark:text-gray-400">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
          {item.to ? (
            <Link
              to={item.to}
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
