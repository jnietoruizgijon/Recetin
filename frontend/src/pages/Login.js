import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const user = await response.json();

      // --- CAMBIO AQUÍ ---
      // Guardamos el objeto usuario como un texto en el almacenamiento del navegador
      localStorage.setItem("user", JSON.stringify(user));
      // -------------------

      login(user);
      navigate("/");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-6 col-lg-4">

          {/* TARJETA DE LOGIN */}
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">

              {/* ICONO Y TÍTULO */}
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '80px', height: '80px' }}>
                  <span style={{ fontSize: '2rem' }}>👤</span>
                </div>
                <h2 className="fw-bold">Bienvenido</h2>
                <p className="text-muted small">Introduce tus credenciales para entrar</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">📧</span>
                    <input
                      type="email"
                      className="form-control bg-light border-start-0"
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">🔒</span>
                    <input
                      type="password"
                      className="form-control bg-light border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* BOTÓN DE ENTRAR */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-sm fw-bold">
                    Entrar
                  </button>
                </div>
              </form>

              {/* MENSAJE DE ERROR */}
              {error && (
                <div className="alert alert-danger mt-4 py-2 small border-0 text-center" role="alert">
                  ⚠️ {error}
                </div>
              )}

              {/* LINK DE REGISTRO */}
              <div className="text-center mt-4">
                <p className="small text-muted mb-0">
                  ¿No tienes cuenta? <Link to="/register" className="text-primary fw-bold text-decoration-none">Regístrate</Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
