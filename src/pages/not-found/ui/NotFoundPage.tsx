import { Header } from "@/widgets/header";
import { NOT_FOUND_TITLE, NotFound } from "@/widgets/not-found";

export const NotFoundPage = () => (
  <div className="relative min-h-screen p-4 mx-auto max-w-7xl">
    <div className="mb-[60px] sm:mb-[65px]">
      <Header title={NOT_FOUND_TITLE} />
    </div>
    <NotFound />
  </div>
);
