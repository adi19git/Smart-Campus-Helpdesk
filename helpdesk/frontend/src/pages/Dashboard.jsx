import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import StudentDashboard from '../components/Dashboard/StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Route to the appropriate dashboard based on user role
  if (user?.isStaff) {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
};

export default Dashboard;
