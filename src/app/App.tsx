import { GoToTop } from "@/features/go-to-top";
import { Toaster } from "@/shared/ui/Toaster";
import { Footer } from "@/widgets/footer";
import { AppRoutes } from "./routes/AppRoutes";

export const App = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <main className="mx-auto px-[200px] sm:px-1 sm:py-0 py-4">
      <AppRoutes />
    </main>

    <Footer />
    <GoToTop />
    <Toaster />
  </div>
);
