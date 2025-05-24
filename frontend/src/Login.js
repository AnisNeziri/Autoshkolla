import React from 'react';
import './Form.css';

function Login() {
  return (
    <div className="form-container">
      <h2>Hyr në Llogari</h2>
      <form>
        <input type="email" placeholder="Email ose Kodi Referues" />
        <input type="password" placeholder="Fjalëkalimi" />
        <button type="submit">Hyr</button>
      </form>
    </div>
  );
}

export default Login;
