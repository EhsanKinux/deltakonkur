import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface UseBackNavigationOptions {
  fallbackRoute?: string;
  checkReferrer?: boolean;
  preserveState?: boolean;
}

interface NavigationState {
  canGoBack: boolean;
  previousPath?: string;
}

/**
 * Custom hook for professional back navigation
 * Handles different scenarios and provides fallback options
 */
export const useBackNavigation = (options: UseBackNavigationOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    canGoBack: false,
  });

  const {
    fallbackRoute,
    checkReferrer = true,
    preserveState = false,
  } = options;

  // Track navigation state
  useEffect(() => {
    const canGoBack = window.history.length > 1;
    setNavigationState({
      canGoBack,
      previousPath: canGoBack ? document.referrer : undefined,
    });
  }, [location.pathname]);

  const goBack = useCallback(() => {
    try {
      // Check if there's a previous page in the history
      if (window.history.length > 1) {
        // If referrer checking is enabled, analyze the referrer
        if (checkReferrer) {
          const referrer = document.referrer;
          const currentOrigin = window.location.origin;

          // If we came from the same origin
          if (referrer.startsWith(currentOrigin)) {
            // Extract the path from referrer
            const referrerPath = new URL(referrer).pathname;

            // Check if the previous page was a valid route
            if (referrerPath && referrerPath !== window.location.pathname) {
              // Use browser back for same-origin navigation
              window.history.back();
              return;
            }
          }
        } else {
          // If referrer checking is disabled, just use browser back
          window.history.back();
          return;
        }
      }

      // Fallback: navigate to specified route or default
      if (fallbackRoute) {
        navigate(fallbackRoute, { replace: !preserveState });
      } else {
        // Default fallback - go to dashboard
        navigate("/dashboard", { replace: !preserveState });
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Emergency fallback
      if (fallbackRoute) {
        navigate(fallbackRoute, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate, fallbackRoute, checkReferrer, preserveState]);

  const goToSpecificRoute = useCallback(
    (route: string, replace = false) => {
      try {
        navigate(route, { replace });
      } catch (error) {
        console.error("Navigation error:", error);
        // Emergency fallback
        navigate("/dashboard", { replace: true });
      }
    },
    [navigate]
  );

  const goBackWithState = useCallback(
    (state?: Record<string, unknown>) => {
      try {
        if (window.history.length > 1) {
          window.history.back();
        } else if (fallbackRoute) {
          navigate(fallbackRoute, { state, replace: !preserveState });
        } else {
          navigate("/dashboard", { state, replace: !preserveState });
        }
      } catch (error) {
        console.error("Navigation error:", error);
        if (fallbackRoute) {
          navigate(fallbackRoute, { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    },
    [navigate, fallbackRoute, preserveState]
  );

  return {
    goBack,
    goToSpecificRoute,
    goBackWithState,
    canGoBack: navigationState.canGoBack,
    previousPath: navigationState.previousPath,
  };
};

export default useBackNavigation;
