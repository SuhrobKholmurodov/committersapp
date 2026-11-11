import { Globe } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { flagUrl, isWorldwide } from "../lib/country";
import type { Country } from "../model/types";

interface CountryFlagProps {
  country: Pick<Country, "slug" | "name" | "code">;
  fallbackUrl?: string;
  className?: string;
  eager?: boolean;
}

export const CountryFlag = ({ country, fallbackUrl, className, eager = false }: CountryFlagProps) => {
  const baseClassName = cn("w-10 h-7 rounded border shadow-sm dark:border-gray-800", className);

  if (isWorldwide(country)) {
    return (
      <span
        className={cn(
          baseClassName,
          "flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
        )}
        aria-hidden="true"
      >
        <Globe className="w-4 h-4" />
      </span>
    );
  }

  const src = country.code ? flagUrl(country.code, 40) : fallbackUrl;

  if (!src) {
    return (
      <span
        className={cn(
          baseClassName,
          "flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700",
        )}
        aria-hidden="true"
      >
        <span className="text-xs font-bold text-gray-500">🏳️</span>
      </span>
    );
  }

  return (
    <img
      src={src}
      srcSet={country.code ? `${flagUrl(country.code, 80)} 2x` : undefined}
      width={40}
      height={28}
      alt={`Flag of ${country.name}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn(baseClassName, "object-cover")}
    />
  );
};
