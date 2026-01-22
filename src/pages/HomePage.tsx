import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FileManager from "../components/FileManager";
import { useFileContext } from "../context/FileContext";
import { getViewFromRoute } from "../utils/routeMapping";

const HomePage: FC = () => {
  const location = useLocation();
  const { setCurrentView } = useFileContext();

  useEffect(() => {
    // Extract the route from the pathname (e.g., "/my-drive" -> "my-drive")
    const route = location.pathname.split('/').filter(Boolean)[0] || 'home';
    const view = getViewFromRoute(route);
    setCurrentView(view);
  }, [location.pathname, setCurrentView]);

  return <FileManager />;
};

export default HomePage;
