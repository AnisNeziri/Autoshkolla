import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css';
import sq from './i18n/sq';

const Layout = () => (
  <div className="App">
    <header className="header">
      <nav className="navbar">
        <h1 className="logo">{sq.brand}</h1>
        <ul className="nav-links">
          <li>
            <a href="#about">{sq.nav.about}</a>
          </li>
          <li>
            <a href="#features">{sq.home.featuresTitle}</a>
          </li>
          <li>
            <a href="#contact">{sq.nav.contact}</a>
          </li>
          <li className="dropdown">
            <span>{sq.nav.authMenu}</span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/register">{sq.nav.register}</Link>
              </li>
              <li>
                <Link to="/login">{sq.nav.login}</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <Outlet />
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} {sq.brand}
        </p>
        <div className="social-links">
          <a href="https://facebook.com">
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              width="30"
              alt="Facebook"
            />
          </a>
          <a href="https://instagram.com">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
              width="30"
              alt="Instagram"
            />
          </a>
        </div>
      </div>
    </footer>
  </div>
);

export default Layout;
