import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [activeTab, setActiveTab] = useState("users"); // 'users' o 'recipes'
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    console.log("Usuario actual:", user); 
    console.log("Rol detectado:", user?.role)

    // Redirección de seguridad si entra alguien que no es admin
    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            navigate("/");
        }
    }, [user, navigate]);

    // Cargar datos
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // Si no hay token, ni lo intentamos
        if (!token) return;

        const headers = { "Authorization": `Bearer ${token}` };

        try {
            // --- CARGAR USUARIOS ---
            const resUsers = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, { headers });

            // Si da error (ej: 403 Forbidden), lanzamos excepción para saltar al catch
            if (!resUsers.ok) {
                if (resUsers.status === 403) {
                    console.error("Acceso denegado. Tu token no tiene rol de ADMIN.");
                    navigate("/"); // Te echamos fuera suavemente
                    return;
                }
                throw new Error("Error al cargar usuarios");
            }

            const dataUsers = await resUsers.json();
            setUsers(dataUsers);

            // --- CARGAR RECETAS ---
            const resRecipes = await fetch(`${process.env.REACT_APP_API_URL}/admin/recipes`, { headers });

            if (!resRecipes.ok) throw new Error("Error al cargar recetas");

            const dataRecipes = await resRecipes.json();
            setRecipes(dataRecipes);

        } catch (error) {
            console.error("Error en el panel de admin:", error);
            // Opcional: poner un estado de error para mostrar un mensaje en la UI
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
        await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchData(); // Recargar tabla
    };

    const handleDeleteRecipe = async (id) => {
        if (!window.confirm("¿Borrar esta receta permanentemente?")) return;
        await fetch(`${process.env.REACT_APP_API_URL}/admin/recipes/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchData();
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4">🛡️ Panel de Administración</h1>

            {/* PESTAÑAS */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
                        👥 Usuarios ({users.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "recipes" ? "active" : ""}`} onClick={() => setActiveTab("recipes")}>
                        🍳 Recetas ({recipes.length})
                    </button>
                </li>
            </ul>

            {/* TABLA DE USUARIOS */}
            {activeTab === "users" && (
                <div className="table-responsive bg-white p-3 rounded shadow-sm">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td className="fw-bold">{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role !== 'ADMIN' && (
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.id)}>
                                                ⛔ Banear
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TABLA DE RECETAS */}
            {activeTab === "recipes" && (
                <div className="table-responsive bg-white p-3 rounded shadow-sm">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Autor (ID)</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.title}</td>
                                    <td>{r.ownerId || "Desconocido"}</td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRecipe(r.id)}>
                                            🗑️ Eliminar
                                        </button>
                                        <a href={`/recipes/${r.id}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary ms-2">
                                            👁️ Ver
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;