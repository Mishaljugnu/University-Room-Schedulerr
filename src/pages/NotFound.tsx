
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg text-center">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-red-500">404</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, the page you're looking for at <span className="font-medium">{location.pathname}</span> doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            className="bg-umblue hover:bg-umblue-light flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
