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
            <li><a href="#courses">Kursoret</a></li>
            <li><a href="#contact">Kontakti</a></li>
          </ul>
        </nav>
        <div className="hero">
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
          <li>🅱 Kursi për Kategorinë B</li>
          <li>🅰 Kursi për Kategorinë A</li>
          <li>📚 Trajnim teorik dhe praktik</li>
        </ul>
      </section>

      <section id="contact" className="section">
        <h2>Na Kontaktoni</h2>
        <p>📍 Adresa: Rruga Kryesore, Tirane, Shqipëri</p>
        <p>📞 Telefoni: +355 69 123 4567</p>
        <p>✉️ Email: info@autoshkolla.com</p>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Autoshkolla. Të gjitha të drejtat e rezervuara.</p>
      </footer>
    </div>
  );
}

export default App;
