import { ToastContainer } from "react-fox-toast";
import { useIsClient } from "@/shared/lib/hooks";

export const Toaster = () => {
  const isClient = useIsClient();
  return isClient ? <ToastContainer position="top-right" /> : null;
};
