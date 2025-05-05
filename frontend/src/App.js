import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <nav className="navbar">
          <h1 className="logo">Autoshkolla Premium</h1>
          <ul className="nav-links">
            <li><a href="#about">Rreth Nesh</a></li>
            <li><a href="#contact">Kontakti</a></li>
            <li><a href="#join">Join</a></li>
          </ul>
        </nav>
        <div className="hero" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1518689000812-44e345196396?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '100px 20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Mirë se vini në Sistemin e Menaxhimit të Autoshkollave</h2>
          <p style={{ fontSize: '1.5rem' }}>Krijo më let se kurrë një sistem për studentët tuaj</p>
          <a href="#contact" className="cta-button">Regjistrohu Tani</a>
        </div>
      </header>

      <section id="about" className="section">
        <h2>Rreth Nesh</h2>
        <p>Ne synojmë krijimin e një formati sa më të let për monitorimin e arritjeve të studentëve tuaj në rrugëtimin e tyre për tu bërë vozitës të rinj</p>
      </section>

      <section id="sh" className="section dark">
        <h2>Shërbimet që ne ofrojmë</h2>
        <div className="sh-list">
          <div className="sh-card">
            <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80" alt="Category B" />
            <h3>Menaxhimi nga Autoshkollat</h3>
            <p>Dashboard për studentët tuaj, gjendja me praktikë, gjendja me ligjerata dhe datat e provimeve të patentës</p>
          </div>
          <div className="sh-card">
            <img src="https://images.unsplash.com/photo-1570616969692-54d6ba3d0397?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Category A" />
            <h3>Sistem për studentët</h3>
            <p>Rrjedha e tyre në autoshkollë, datat e provimeve dhe teste për aftësimin e tyre</p>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <h2>Na Kontaktoni</h2>
        <p>Email: info@autoshkolla.com</p>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Autoshkolla Premium</p>
          <div className="social-links">
            <a href="https://facebook.com"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="30" /></a>
            <a href="https://instagram.com"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="30" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
