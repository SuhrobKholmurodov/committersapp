import { useState, type ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ContinentPage } from "@/pages/continent";
import { CountryPage } from "@/pages/country";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";

const PageTransition = ({ animate, children }: { animate: boolean; children: ReactNode }) => (
  <div className={animate ? "animate-fade-in-up" : undefined}>{children}</div>
);

const useHasNavigated = () => {
  const { key } = useLocation();
  const [initialKey] = useState(key);
  return key !== initialKey;
};

export const AppRoutes = () => {
  const animate = useHasNavigated();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageTransition animate={animate}>
            <HomePage />
          </PageTransition>
        }
      />
      <Route
        path="/continent/:continent"
        element={
          <PageTransition animate={animate}>
            <ContinentPage />
          </PageTransition>
        }
      />
      <Route
        path="/:slug"
        element={
          <PageTransition animate={animate}>
            <CountryPage />
          </PageTransition>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
