import type { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { CountryPage } from "@/pages/country";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";

const PageTransition = ({ children }: { children: ReactNode }) => (
  <div className="animate-fade-in-up">{children}</div>
);

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PageTransition>
          <HomePage />
        </PageTransition>
      }
    />
    <Route
      path="/:slug"
      element={
        <PageTransition>
          <CountryPage />
        </PageTransition>
      }
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
