// src/components/withAuth.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';

interface WithAuthProps {
  children?: React.ReactNode;
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P & WithAuthProps) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated()) {
        navigate('/login');
      }
    }, [navigate]);

    return isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
