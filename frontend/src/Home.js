import React from 'react';
import { Link } from 'react-router-dom';
import sq from './i18n/sq';

const Home = () => (
  <>
    <section className="landing-hero">
      <div className="landing-hero__inner">
        <p className="landing-eyebrow">{sq.brandTagline}</p>
        <h1 className="landing-title">{sq.home.heroTitle}</h1>
        <p className="landing-lead">{sq.home.heroSubtitle}</p>
        <div className="landing-cta-row">
          <Link to="/register" className="btn-landing btn-landing--primary">
            {sq.home.ctaPrimary}
          </Link>
          <Link to="/login" className="btn-landing btn-landing--outline">
            {sq.home.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>

    <section id="features" className="landing-section">
      <div className="landing-container">
        <h2 className="landing-section-title">{sq.home.featuresTitle}</h2>
        <div className="landing-grid landing-grid--3">
          <article className="landing-card">
            <h3>{sq.home.feature1Title}</h3>
            <p>{sq.home.feature1Desc}</p>
          </article>
          <article className="landing-card">
            <h3>{sq.home.feature2Title}</h3>
            <p>{sq.home.feature2Desc}</p>
          </article>
          <article className="landing-card">
            <h3>{sq.home.feature3Title}</h3>
            <p>{sq.home.feature3Desc}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="how" className="landing-section landing-section--alt">
      <div className="landing-container">
        <h2 className="landing-section-title">{sq.home.howTitle}</h2>
        <div className="landing-steps">
          <div className="landing-step">
            <span className="landing-step__num">1</span>
            <div>
              <h3>{sq.home.how1Title}</h3>
              <p>{sq.home.how1Desc}</p>
            </div>
          </div>
          <div className="landing-step">
            <span className="landing-step__num">2</span>
            <div>
              <h3>{sq.home.how2Title}</h3>
              <p>{sq.home.how2Desc}</p>
            </div>
          </div>
          <div className="landing-step">
            <span className="landing-step__num">3</span>
            <div>
              <h3>{sq.home.how3Title}</h3>
              <p>{sq.home.how3Desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" className="landing-section">
      <div className="landing-container landing-contact">
        <h2 className="landing-section-title">{sq.home.contactTitle}</h2>
        <p className="mb-0">
          {sq.home.contactEmail}:{' '}
          <a href="mailto:info@autoshkolla.com" className="landing-link">
            info@autoshkolla.com
          </a>
        </p>
      </div>
    </section>
  </>
);

export default Home;
