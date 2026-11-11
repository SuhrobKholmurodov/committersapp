import { toast } from "react-fox-toast";

type ToastType = "success" | "error" | "info";

export const showToast = (type: ToastType, message: string) => {
  toast[type](
    <div className="flex items-center gap-2">
      <span>{message}</span>
    </div>,
  );
};
