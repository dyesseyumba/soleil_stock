import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout } from '@/api/authApi';

function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.invalidateQueries();
    },
  });
}

function useLogout() {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
    },
  });
}

function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  });

  useEffect(() => {
    // const token = localStorage.getItem('accessToken');
    // setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { isAuthenticated };
}

export { useLogin, useLogout, useAuthStatus };
