import { useEffect, useState } from "react";
import { useNavigationContainerRef } from "@react-navigation/native";

export const useRouterReady = () => {
  const navRef = useNavigationContainerRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (navRef.isReady()) {
        setIsReady(true);
      }
    }, 100); // slight delay to allow hydration

    return () => clearTimeout(timeout);
  }, [navRef]);

  return isReady;
};
