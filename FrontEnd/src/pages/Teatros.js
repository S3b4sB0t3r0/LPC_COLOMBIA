import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Teatros.css';

function Teatros() {
  const [teatros, setTeatros] = useState([]);
  const [teatroSeleccionado, setTeatroSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const teatrosPorPagina = 6;

  const API_URL = process.env.REACT_APP_API_URL;

  // Cargar teatros desde la base de datos
  useEffect(() => {
    const cargarTeatros = async () => {
      try {
        const response = await axios.get(`${API_URL}/teatros`);
        setTeatros(response.data);
      } catch (error) {
        console.error('Error al cargar los teatros:', error);
      }
    };
    cargarTeatros();
  }, [API_URL]);

  const abrirModal = (teatro) => setTeatroSeleccionado(teatro);

  const cerrarModal = () => setTeatroSeleccionado(null);

  const handleActualizarTeatro = async (datosActualizados) => {
    if (teatroSeleccionado) {
      try {
        await axios.put(`${API_URL}/teatros/${teatroSeleccionado._id}`, datosActualizados);
        const teatrosActualizados = teatros.map((teatro) =>
          teatro._id === teatroSeleccionado._id ? { ...teatro, ...datosActualizados } : teatro
        );
        setTeatros(teatrosActualizados);
        cerrarModal();
      } catch (error) {
        console.error('Error al actualizar el teatro:', error);
      }
    }
  };

  // Filtrar teatros según la búsqueda
  const teatrosFiltrados = teatros.filter((teatro) =>
    teatro.nombre.toLowerCase().includes(busqueda.toLowerCase())
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
      <div className="teatros-grid">
        {teatrosActuales.length > 0 ? (
          teatrosActuales.map((teatro) => (
            <div key={teatro._id} className="teatro-card" onClick={() => abrirModal(teatro)}>
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
          >
            {index + 1}
          </button>
        ))}
      </div>

      {teatroSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={cerrarModal}>
              &times;
            </span>
            <div className="modal-inner">
              <h2>Editar Teatro</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const datosActualizados = {
                    nombre: e.target.nombre.value,
                    ubicacion: e.target.ubicacion.value,
                    capacidad: e.target.capacidad.value,
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
