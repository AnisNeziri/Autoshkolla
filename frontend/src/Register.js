import React from 'react';
import './Form.css';

function Register() {
  return (
    <div className="form-container">
      <h2>Regjistro Autoshkollën</h2>
      <form>
        <input type="text" placeholder="Emri i Autoshkollës" />
        <input type="text" placeholder="Emri dhe Mbiemri i Pronarit" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Fjalëkalimi" />
        <button type="submit">Regjistrohu</button>
      </form>
    </div>
  );
}

export default Register;
