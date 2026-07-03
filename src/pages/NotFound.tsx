import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import EmptyState from "@/components/retrofly/EmptyState";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <EmptyState
        emoji="🤔"
        title="Page not found"
        description="The page you're looking for doesn't exist."
        actionLabel="Go to Dashboard"
        actionHref="/dashboard"
        useMascot
      />
    </div>
  );
};

export default NotFound;
