
import React, { useEffect, useCallback, type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLoader from "./reuseable/AppLoader";


interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem("user");

  console.log(isAuthenticated, authentication,"user")

  const checkAuth = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (authentication && !isAuthenticated) {
      navigate("/signin");
      return;
    }

    if (!authentication && isAuthenticated) {
      navigate("/");
      return;
    }
      setIsLoading(false);
  }, [authentication, navigate, isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

   if (isLoading) {
    return (
    <AppLoader />
    );
  }

  return <>{children}</>;
};

export default Protected;
