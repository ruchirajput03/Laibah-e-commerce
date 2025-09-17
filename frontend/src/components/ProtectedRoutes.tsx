'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const MAX_RETRIES = 3;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  // alert("Protect Route me")
  console.log(user,"user in protected route")
  // alert(user)
  const fetchUserIfMissing = async () => {
    console.log("Fetching user data in ProtectedRoute");

    try {
      setIsFetching(true);
      const res = await axios.get('http://localhost:8080/api/auth/fetchuser', {
       withCredentials:true,
      });

      if (!res.data?.data) throw new Error('User not found');

      localStorage.setItem('adminUser', JSON.stringify(res.data.data));
      window.location.reload(); // re-syncs context with new data
    } catch (error) {
      console.error('Error fetching user:', error);
      if (attempts < MAX_RETRIES) {
        setAttempts((prev) => prev + 1);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/login');
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    console.log("useEffect in ProtectedRoute",user, attempts)
    if (!user && attempts < MAX_RETRIES) {
      console.log("Fetching user data in ProtectedRoute");
      fetchUserIfMissing();
    }

    if (!user) {
      console.log("User not found, redirecting to login");
      router.push('/login');
    } else if (user.role !== 'admin') {
      console.log("User is not admin, redirecting to login");
      router.push('/login');
    }
  }, [isLoading,user, attempts]);

  if (isLoading || isFetching || (!user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-b-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
