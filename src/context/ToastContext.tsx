import { createContext, useState, type ReactNode } from "react";
import ToastShow from "../components/reuseable/ToastShow";

type ToastType = "success" | "error" ;

export interface ToastContextProps {
  showToast: (msg: string, type?: ToastType, loading?: boolean) => void;
}

export const ToastCreateContext = createContext<ToastContextProps | undefined>(
  undefined,
);

export const ToastContext = ({ children }: { children: ReactNode }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string, type: ToastType = "success", loading= false) => {

    setToastMessage(msg);
    setToastType(type);
    setToastOpen(true);
    setLoading(loading);
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
        loading={loading}
      />
    </ToastCreateContext.Provider>
  );
};
