import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  className?: string;
}

export const ErrorMessage = ({
  title = "Error loading data",
  message = "Please try again later.",
  className,
}: ErrorMessageProps) => (
  <div
    role="alert"
    className={cn(
      "flex flex-col items-center justify-center p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700",
      className,
    )}
  >
    <AlertTriangle
      className="mb-2 text-red-500 dark:text-red-400"
      size={28}
      aria-hidden="true"
    />
    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
      {title}
    </p>
    <p className="mt-1 text-sm text-red-500 dark:text-red-300">{message}</p>
  </div>
);
