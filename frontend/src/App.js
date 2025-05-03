import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <nav className="navbar">
          <h1 className="logo">Autoshkolla</h1>
          <ul className="nav-links">
            <li><a href="#about">Rreth Nesh</a></li>
            <li><a href="#courses">Kurset</a></li>
            <li><a href="#contact">Kontakti</a></li>
          </ul>
        </nav>
        <div className="hero" style={{ backgroundImage: 'url(https://via.placeholder.com/1500x800.png?text=Hero+Image)' }}>
          <h2>Mirë se vini në Autoshkollën tonë</h2>
          <p>Mësoni të ngisni makinën me profesionalizëm dhe siguri</p>
          <a href="#contact" className="cta-button">Regjistrohu Tani</a>
        </div>
      </header>

      <section id="about" className="section">
        <h2>Rreth Autoshkollës</h2>
        <p>Ne ofrojmë trajnime të plota teorike dhe praktike për kategoritë A dhe B. Me instruktorë të certifikuar dhe automjete të sigurta, suksesi juaj është prioriteti ynë.</p>
      </section>

      <section id="courses" className="section dark">
        <h2>Kursoret që ofrojmë</h2>
        <ul>
          <li>
            <img src="https://via.placeholder.com/500x300.png?text=Category+B" alt="Category B" className="course-image" />
            Kursi për Kategorinë B
          </li>
          <li>
            <img src="https://via.placeholder.com/500x300.png?text=Category+A" alt="Category A" className="course-image" />
            Kursi për Kategorinë A
          </li>
          <li>Trajnim teorik dhe praktik</li>
        </ul>
      </section>

      <section id="contact" className="section">
        <h2>Na Kontaktoni</h2>
        <p>Adresa: Ferizaj 70000, Kosovë </p>
        <p>Telefoni: +383 45 121 212</p>
        <p>Email: info@autoshkolla.com</p>
      </section>

      <footer className="footer">
        <div className="footer-left">
          <p>&copy; 2025 Autoshkolla</p>
          <div className="social-links">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="https://via.placeholder.com/40x40.png?text=FB" alt="Facebook" className="social-icon" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="https://via.placeholder.com/40x40.png?text=IG" alt="Instagram" className="social-icon" />
            </a>
          </div>
        </div>
        <div className="footer-right">
          <p>Na Kontaktoni:</p>
          <p>Telefononi: +383 45 121 212</p>
          <p>Email: info@autoshkolla.com</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
