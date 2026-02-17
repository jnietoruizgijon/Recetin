import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            if (!response.ok) {
                throw new Error("Error al registrar usuario");
            }

            // Si el registro es correcto, te lleva al login
            navigate("/login");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '2rem 0' }}>
            <div className="row justify-content-center w-100 m-0">
                <div className="col-12 col-md-6 col-lg-5">

                    {/* TARJETA DE REGISTRO */}
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4 p-md-5">

                            {/* CABECERA */}
                            <div className="text-center mb-4">
                                <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{ width: '70px', height: '70px' }}>
                                    <span style={{ fontSize: '2rem' }}>📝</span>
                                </div>
                                <h2 className="fw-bold">Crear Cuenta</h2>
                                <p className="text-muted small">Únete a la comunidad de Recetín</p>
                            </div>

                            <form onSubmit={handleSubmit}>

                                {/* NOMBRE DE USUARIO */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Nombre de Usuario</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">👤</span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-start-0"
                                            placeholder="Tu nombre de chef"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Correo Electrónico</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">📧</span>
                                        <input
                                            type="email"
                                            className="form-control bg-light border-start-0"
                                            placeholder="chef@recetin.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small">Contraseña</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">🔒</span>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-start-0"
                                            placeholder="Crea una clave segura"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* BOTÓN REGISTRARSE */}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-success btn-lg rounded-pill shadow-sm fw-bold">
                                        Registrarse
                                    </button>
                                </div>
                            </form>

                            {/* MENSAJE DE ERROR */}
                            {error && (
                                <div className="alert alert-danger mt-4 py-2 small border-0 text-center" role="alert">
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* VOLVER AL LOGIN */}
                            <div className="text-center mt-4">
                                <p className="small text-muted mb-0">
                                    ¿Ya tienes cuenta? <Link to="/login" className="text-success fw-bold text-decoration-none">Inicia sesión aquí</Link>
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Register;