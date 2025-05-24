import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css';

const Layout = () => (
  <div className="App">
    <header className="header">
      <nav className="navbar">
        <h1 className="logo">Autoshkolla Premium</h1>
        <ul className="nav-links">
          <li><a href="#about">Rreth Nesh</a></li>
          <li><a href="#contact">Kontakti</a></li>
          <li className="dropdown">
            <span>Join</span>
            <ul className="dropdown-menu">
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Log In</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <Outlet />
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Autoshkolla Premium</p>
        <div className="social-links">
          <a href="https://facebook.com"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="30" alt="Facebook" /></a>
          <a href="https://instagram.com"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="30" alt="Instagram" /></a>
        </div>
      </div>
    </footer>
  </div>
);

export default Layout;
