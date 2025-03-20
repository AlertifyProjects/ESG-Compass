import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div className="auth-logo">
        <h1>ESGCompass</h1>
      </div>
      <div className="auth-content">
        <Outlet />
      </div>
      <footer className="auth-footer">
        <p>&copy; {new Date().getFullYear()} ESGCompass. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;