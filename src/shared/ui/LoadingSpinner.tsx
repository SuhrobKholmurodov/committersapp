import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
}

export const LoadingSpinner = ({ label = "Fetching data..." }: LoadingSpinnerProps) => (
  <div
    role="status"
    className="flex flex-col items-center justify-center mt-12"
  >
    <Loader2 className="mb-3 text-blue-500 animate-spin" size={32} aria-hidden="true" />
    <p className="font-medium text-center text-blue-600 dark:text-blue-400">
      {label}
    </p>
  </div>
);
