import { createContext, useState, type ReactNode } from "react";
import ToastShow from "../components/reuseable/ToastShow";

type ToastType = "success" | "error";

export interface ToastContextProps {
  showToast: (msg: string, type?: ToastType) => void;
}

export const ToastCreateContext = createContext<ToastContextProps | undefined>(
  undefined,
);

export const ToastContext = ({ children }: { children: ReactNode }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  const showToast = (msg: string, type: ToastType = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setToastOpen(true);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <ToastCreateContext.Provider value={{ showToast }}>
      {children}
      <ToastShow
        isOpen={toastOpen}
        msg={toastMessage}
        type={toastType}
        onClose={handleToastClose}
      />
    </ToastCreateContext.Provider>
  );
};
