import React from 'react';
import { Link } from 'react-router-dom';
import sq from './i18n/sq';

const Home = () => (
  <>
    <div
      className="hero"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1518689000812-44e345196396?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>{sq.home.heroTitle}</h2>
      <p style={{ fontSize: '1.5rem' }}>{sq.home.heroSubtitle}</p>
      <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
        <Link to="/register" className="cta-button">
          {sq.home.ctaPrimary}
        </Link>
        <Link to="/login" className="cta-button">
          {sq.home.ctaSecondary}
        </Link>
      </div>
    </div>

    <section id="about" className="section">
      <h2>{sq.nav.about}</h2>
      <p>{sq.home.feature1Desc}</p>
    </section>

    <section id="features" className="section dark">
      <h2>{sq.home.featuresTitle}</h2>
      <div className="sh-list">
        <div className="sh-card">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80"
            alt=""
          />
          <h3>{sq.home.feature1Title}</h3>
          <p>{sq.home.feature1Desc}</p>
        </div>
        <div className="sh-card">
          <img
            src="https://images.unsplash.com/photo-1570616969692-54d6ba3d0397?q=80&w=2022&auto=format&fit=crop"
            alt=""
          />
          <h3>{sq.home.feature2Title}</h3>
          <p>{sq.home.feature2Desc}</p>
        </div>
        <div className="sh-card">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f310d?auto=format&fit=crop&w=500&q=80"
            alt=""
          />
          <h3>{sq.home.feature3Title}</h3>
          <p>{sq.home.feature3Desc}</p>
        </div>
      </div>
    </section>

    <section className="section">
      <h2>{sq.home.howTitle}</h2>
      <p>
        <strong>{sq.home.how1Title}</strong> — {sq.home.how1Desc}
      </p>
      <p>
        <strong>{sq.home.how2Title}</strong> — {sq.home.how2Desc}
      </p>
      <p>
        <strong>{sq.home.how3Title}</strong> — {sq.home.how3Desc}
      </p>
    </section>

    <section id="contact" className="section dark">
      <h2>{sq.home.contactTitle}</h2>
      <p>
        {sq.home.contactEmail}: info@autoshkolla.com
      </p>
    </section>
  </>
);

export default Home;
