import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>ESGCompass</h2>
      </div>
      
      <nav className="nav-menu">
        <ul>
          <li className="nav-item">
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/metrics" className="nav-link">
              Metrics
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/metrics/entry" className="nav-link">
              Data Entry
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/reports" className="nav-link">
              Reports
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/organization/profile" className="nav-link">
              Organization
            </NavLink>
          </li>
          
          {isAdmin && (
            <>
              <li className="nav-item">
                <NavLink to="/admin/users" className="nav-link">
                  User Management
                </NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink to="/admin/organizations" className="nav-link">
                  Organizations
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;