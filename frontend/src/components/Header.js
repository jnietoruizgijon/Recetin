import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "../styles/index.css";
import logo from '../img/logo.png'

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className='header'>
      <div className='container header__logo'>
        <a href='/'>
          <img src={logo}/>
        </a>
      </div>
      <nav className='container header__nav'>
        {user ? (
          <>
            <Link to="/">Inicio</Link>
            <span>Hola, <Link to="/profile">{user.username}</Link></span>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;