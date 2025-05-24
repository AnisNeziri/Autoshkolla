import React from 'react';

const Home = () => (
  <>
    <div className="hero" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1518689000812-44e345196396?q=80&w=2070&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      padding: '100px 20px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        Mirë se vini në Sistemin e Menaxhimit të Autoshkollave
      </h2>
      <p style={{ fontSize: '1.5rem' }}>
        Krijo më let se kurrë një sistem për studentët tuaj
      </p>
      <a href="#contact" className="cta-button">Regjistrohu Tani</a>
    </div>

    <section id="about" className="section">
      <h2>Rreth Nesh</h2>
      <p>Ne synojmë krijimin e një formati sa më të lehtë për monitorimin e arritjeve të studentëve tuaj...</p>
    </section>

    <section className="section dark">
      <h2>Shërbimet që ne ofrojmë</h2>
      <div className="sh-list">
        <div className="sh-card">
          <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80" alt="Menaxhimi" />
          <h3>Menaxhimi nga Autoshkollat</h3>
          <p>Dashboard për studentët tuaj, gjendja me praktikë, ligjëratat dhe provimet</p>
        </div>
        <div className="sh-card">
          <img src="https://images.unsplash.com/photo-1570616969692-54d6ba3d0397?q=80&w=2022&auto=format&fit=crop" alt="Studentët" />
          <h3>Sistem për studentët</h3>
          <p>Testet për aftësimin e tyre, njoftime dhe progres i dokumentuar</p>
        </div>
      </div>
    </section>

    <section id="contact" className="section">
      <h2>Na Kontaktoni</h2>
      <p>Email: info@autoshkolla.com</p>
    </section>
  </>
);

export default Home;
