import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../img/logo.png'

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div className="container">

        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Recetín Logo" height="40" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center gap-3">

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-medium" to="/">
                    Inicio
                  </Link>
                </li>

                {user && user.role === 'ADMIN' && (
                  <Link to="/admin" className="btn btn-danger btn-sm rounded-pill ms-2">
                    🛡️ Admin
                  </Link>
                )}

                <li className="nav-item d-flex align-items-center gap-2">
                  <span className="text-muted">Hola,</span>
                  <Link to="/profile" className="fw-bold text-primary text-decoration-none">
                    {user.username}
                  </Link>
                </li>

                <li className="nav-item">
                  <button onClick={logout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-link text-decoration-none text-dark">
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-primary rounded-pill px-4">
                    Registrarse
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;