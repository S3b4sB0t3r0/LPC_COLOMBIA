import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Teatros.css';

function Teatros() {
  const [teatros, setTeatros] = useState([]);
  const [teatroSeleccionado, setTeatroSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const teatrosPorPagina = 6;

  const API_URL = process.env.REACT_APP_API_URL;

  // Cargar teatros desde la base de datos
  useEffect(() => {
    const cargarTeatros = async () => {
      try {
        const response = await axios.get(`${API_URL}/teatros`);
        setTeatros(response.data);
      } catch (error) {
        setError('Error al cargar los teatros. Inténtalo de nuevo más tarde.');
        console.error(error);
      }
    };
    cargarTeatros();
  }, [API_URL]);

  const abrirModal = (teatro) => setTeatroSeleccionado(teatro);

  const cerrarModal = () => setTeatroSeleccionado(null);

  const handleActualizarTeatro = async (datosActualizados) => {
    if (!datosActualizados.nombre || !datosActualizados.ubicacion || !datosActualizados.capacidad) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      await axios.put(`${API_URL}/teatros/${teatroSeleccionado._id}`, datosActualizados);
      const teatrosActualizados = teatros.map((teatro) =>
        teatro._id === teatroSeleccionado._id ? { ...teatro, ...datosActualizados } : teatro
      );
      setTeatros(teatrosActualizados);
      cerrarModal();
      setMensaje('Teatro actualizado correctamente.');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      setError('Error al actualizar el teatro. Inténtalo de nuevo.');
      console.error(error);
    }
  };

  // Filtrar teatros según la búsqueda
  const teatrosFiltrados = teatros.filter((teatro) =>
    teatro.nombre && teatro.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );


  const indexOfLastTeatro = paginaActual * teatrosPorPagina;
  const indexOfFirstTeatro = indexOfLastTeatro - teatrosPorPagina;
  const teatrosActuales = teatrosFiltrados.slice(indexOfFirstTeatro, indexOfLastTeatro);
  const totalPaginas = Math.ceil(teatrosFiltrados.length / teatrosPorPagina);

  const irANuevaPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  return (
    <div className="teatros-container">
      <div className="header">
        <h2>Gestión de Teatros</h2>
        <input
          type="text"
          placeholder="Buscar teatros..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador"
        />
      </div>
      {mensaje && <div className="notification success">{mensaje}</div>}
      {error && <div className="notification error">{error}</div>}
      <div className="teatros-grid">
        {teatrosActuales.length > 0 ? (
          teatrosActuales.map((teatro) => (
            <div
              key={teatro._id}
              className="teatro-card"
              onClick={() => abrirModal(teatro)}
              role="button"
              tabIndex={0}
              aria-label={`Editar información del teatro ${teatro.nombre}`}
            >
              <h3>{teatro.nombre}</h3>
              <p>{teatro.ubicacion}</p>
              <p>{teatro.capacidad} personas</p>
            </div>
          ))
        ) : (
          <p>No hay teatros disponibles.</p>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => irANuevaPagina(index + 1)}
            className={`pagination-button ${paginaActual === index + 1 ? 'active' : ''}`}
            aria-label={`Ir a la página ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {teatroSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span
              className="close-button"
              onClick={cerrarModal}
              role="button"
              tabIndex={0}
              aria-label="Cerrar modal"
            >
              &times;
            </span>
            <div className="modal-inner">
              <h2>Editar Teatro</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const datosActualizados = {
                    nombre: e.target.nombre.value.trim(),
                    ubicacion: e.target.ubicacion.value.trim(),
                    capacidad: parseInt(e.target.capacidad.value, 10),
                  };
                  handleActualizarTeatro(datosActualizados);
                }}
              >
                <label>
                  Nombre:
                  <input type="text" name="nombre" defaultValue={teatroSeleccionado.nombre} />
                </label>
                <label>
                  Ubicación:
                  <input type="text" name="ubicacion" defaultValue={teatroSeleccionado.ubicacion} />
                </label>
                <label>
                  Capacidad:
                  <input type="number" name="capacidad" defaultValue={teatroSeleccionado.capacidad} />
                </label>
                <button type="submit">Guardar Cambios</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teatros;
