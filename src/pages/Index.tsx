
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { CalendarRange, Building, BookOpen, Search } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is logged in, redirect to the appropriate dashboard
  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-umblue to-umblue-dark text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bTAgMTJ2Nmg2di02aC02em0wIDEydjZoNnYtNmgtNnptLTEyIDB2Nmg2di02aC02em0wLTEydjZoNnYtNmgtNnptMC0xMnY2aDZ2LTZoLTZ6bTAgMzB2Nmg2di02aC02em0tMTIgMHY2aDZ2LTZoLTZ6bTAtMTJ2Nmg2di02aC02em0wLTEydjZoNnYtNmgtNnptMC02djZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading">
              UM Surabaya Room Scheduler
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Efficient classroom booking system for teachers and administrators at Universitas Muhammadiyah Surabaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-umgold text-umblue-dark hover:bg-umgold-light btn-hover">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="bg-white text-umblue border-white hover:bg-gray-100 hover:text-umblue-dark btn-hover">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading text-umblue">
            Simplify Classroom Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-card card-hover">
              <div className="h-12 w-12 bg-umblue/10 rounded-lg flex items-center justify-center mb-6">
                <CalendarRange className="h-6 w-6 text-umblue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
              <p className="text-gray-600">
                Book classrooms with a few clicks. Select building, room, date, and time for your classes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-card card-hover">
              <div className="h-12 w-12 bg-umblue/10 rounded-lg flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-umblue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Availability at a Glance</h3>
              <p className="text-gray-600">
                Check room availability instantly. See what rooms are free when you need them.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-card card-hover">
              <div className="h-12 w-12 bg-umblue/10 rounded-lg flex items-center justify-center mb-6">
                <Building className="h-6 w-6 text-umblue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Building Management</h3>
              <p className="text-gray-600">
                Administrators can manage campus buildings and classrooms with detailed customization.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-card card-hover">
              <div className="h-12 w-12 bg-umblue/10 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-umblue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Booking Management</h3>
              <p className="text-gray-600">
                Teachers can view, edit and cancel their bookings anytime, anywhere.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-card card-hover">
              <div className="h-12 w-12 bg-umblue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-umblue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Conflict Prevention</h3>
              <p className="text-gray-600">
                System prevents double bookings, ensuring smooth classroom utilization.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-card card-hover">
              <div className="h-12 w-12 bg-umblue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-umblue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Access</h3>
              <p className="text-gray-600">
                Role-based access ensures teachers and administrators have appropriate permissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-umblue text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join UM Surabaya's classroom booking system today and streamline your teaching schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-white text-umblue hover:bg-gray-100 btn-hover">
                Log In Now
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="text-umblue bg-white border-white hover:bg-gray-100 hover:text-umblue-dark btn-hover">
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
