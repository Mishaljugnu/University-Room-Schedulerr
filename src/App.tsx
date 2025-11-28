
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import BookRoom from "./pages/teacher/BookRoom";
import MyBookings from "./pages/teacher/MyBookings";
import Buildings from "./pages/teacher/Buildings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBuildings from "./pages/admin/Buildings";
import Classrooms from "./pages/admin/Classrooms";
import AdminBookings from "./pages/admin/AdminBookings";
import BookingDetail from "./pages/admin/BookingDetail";
import Users from "./pages/admin/Users";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Common Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Teacher Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/book" 
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <BookRoom />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buildings" 
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Buildings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/:id" 
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <BookingDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-booking/:id" 
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <BookRoom />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/buildings" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminBuildings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/classrooms" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Classrooms />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/booking/:id" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <BookingDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
