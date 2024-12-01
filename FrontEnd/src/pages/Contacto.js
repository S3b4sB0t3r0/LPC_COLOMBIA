import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Contacto.css';
import logo from '../image/logo/9.png'; // Asegúrate de que esta ruta sea correcta

function Contacto() {
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // URL de la API desde el entorno
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);
    const data = {
      nombre: formData.get('name'),
      email: formData.get('email'),
      mensaje: formData.get('message'),
    };

    // Validación básica
    if (!data.nombre || !data.email || !data.mensaje) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Enviar el mensaje al servidor
      const response = await axios.post(`${API_URL}/contacto`, data);

      if (response.status === 200) {
        setNotification(response.data.message);
        setTimeout(() => {
          setNotification(null);
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setError(error.response?.data?.message || 'Error al enviar el mensaje.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="contact-container">
      <img src={logo} alt="Logo de Contacto" className="contacto-logo" />
      <h2>Comunícate con nosotros</h2>
      <p>Estás interesado en que te apoyemos con tu evento, comunícate con nosotros.</p>

      {error && (
        <div className="notification error">
          {error}
        </div>
      )}

      {notification && (
        <div className="notification success">
          {notification}
        </div>
      )}

      <form id="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">Nombre</label>
        <input type="text" name="name" id="contact-name" placeholder="Nombre" required />

        <label htmlFor="contact-email">Correo electrónico</label>
        <input type="email" name="email" id="contact-email" placeholder="Correo electrónico*" required />

        <label htmlFor="contact-message">Mensaje</label>
        <textarea name="message" id="contact-message" placeholder="Mensaje" required></textarea>

        <br />
        <button type="submit">ENVIAR</button>
      </form>
    </div>
  );
}

export default Contacto;
