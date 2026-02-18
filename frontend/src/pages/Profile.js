import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import plus from "../img/plus-solid-full.svg"


function Profile() {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const [myRecipes, setMyRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadProfileData();
        }
    }, [user]);

    const loadProfileData = async () => {
        try {
            setLoading(true);

            const recipesResponse = await fetch(`${process.env.REACT_APP_API_URL}/recipes/user/${user.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const favoritesResponse = await fetch(`${process.env.REACT_APP_API_URL}/favorites/${user.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!recipesResponse.ok) throw new Error('Error al cargar mis recetas');
            if (!favoritesResponse.ok) throw new Error('Error al cargar favoritos');

            const recipesData = await recipesResponse.json();
            const favoritesData = await favoritesResponse.json();

            setMyRecipes(recipesData);
            setFavorites(favoritesData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (recipeId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/favorites/${user.id}/${recipeId}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );

            if (response.ok) {
                setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
            }
        } catch (err) {
            console.error('Error al eliminar favorito:', err);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        if (!window.confirm('¿Estás seguro?')) return;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/recipes/${recipeId}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );

            if (response.status === 403) {
                alert('No tienes permiso para eliminar esta receta');
                return;
            }

            if (response.ok) {
                setMyRecipes(prev => prev.filter(r => r.id !== recipeId));
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error al eliminar');
        }
    };


    if (!user) {
        return (
            <div>
                <h2>Acceso restringido</h2>
                <p>Debes <Link to="/login">iniciar sesión</Link> para ver tu perfil.</p>
            </div>
        );
    }

    if (loading) {
        return <div>Cargando perfil...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main className="container py-5">
            {/* CABECERA DE PERFIL (Estilo similar al que hicimos antes) */}
            <div className="text-center mb-5">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                    style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <h1 className="fw-bold">Perfil de {user.username}</h1>
                <p className="text-muted">Gestiona tus recetas y tus platos favoritos</p>
            </div>

            {/* NAVEGACIÓN POR PESTAÑAS (Nav Tabs) */}
            <ul className="nav nav-pills justify-content-center mb-5 gap-2" id="profileTabs" role="tablist">
                <li className="nav-item">
                    <button className="nav-link active rounded-pill px-4" id="recipes-tab" data-bs-toggle="pill" data-bs-target="#recipes" type="button">
                        👨‍🍳 Mis Recetas
                    </button>
                </li>
                <li className="nav-item">
                    <button className="nav-link rounded-pill px-4" id="favs-tab" data-bs-toggle="pill" data-bs-target="#favs" type="button">
                        ❤️ Favoritos
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="profileTabsContent">

                {/* SECCIÓN 1: MIS RECETAS */}
                <div className="tab-pane fade show active" id="recipes" role="tabpanel">
                    <div className="row g-4">
                        {/* Botón Añadir */}
                        <div className="col-12 col-md-4 col-lg-3">
                            <Link to="/recipes/new" className="card h-100 border-dashed d-flex align-items-center justify-content-center text-decoration-none bg-light"
                                style={{ border: '2px dashed #dee2e6', minHeight: '200px' }}>
                                <div className="text-center">
                                    <img src={plus} alt="Añadir" width="40" className="mb-2" />
                                    <p className="fw-bold text-primary mb-0">Nueva Receta</p>
                                </div>
                            </Link>
                        </div>

                        {myRecipes.length === 0 ? (
                            <div className="col-12 col-md-8 d-flex align-items-center">
                                <p className="text-muted mb-0">No has creado ninguna receta aún.</p>
                            </div>
                        ) : (
                            myRecipes.map(recipe => (
                                <div className="col-12 col-md-4 col-lg-3" key={recipe.id}>
                                    <div className="card h-100 shadow-sm border-0">
                                        {recipe.imageUrl && <img src={recipe.imageUrl} className="card-img-top" alt={recipe.title} style={{ height: '150px', objectFit: 'cover' }} />}
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold text-truncate">{recipe.title}</h5>
                                            <Link to={`/recipes/${recipe.id}`} className="btn btn-outline-primary btn-sm w-100 rounded-pill">Gestionar</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* SECCIÓN 2: MIS FAVORITOS */}
                <div className="tab-pane fade" id="favs" role="tabpanel">
                    {favorites.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted fs-5">Aún no tienes recetas favoritas. ¡Explora y dales a ❤️!</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {favorites.map(recipe => (
                                <div className="col-12 col-md-6 col-lg-4" key={recipe.id}>
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body d-flex gap-3">
                                            {recipe.imageUrl && (
                                                <img src={recipe.imageUrl} alt={recipe.title} className="rounded" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                            )}
                                            <div className="flex-grow-1">
                                                <h5 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '150px' }}>{recipe.title}</h5>
                                                <div className="d-flex gap-2">
                                                    <Link to={`/recipes/${recipe.id}`} className="btn btn-link btn-sm p-0 text-decoration-none">Ver</Link>
                                                    <button
                                                        onClick={() => handleRemoveFavorite(recipe.id)}
                                                        className="btn btn-link btn-sm p-0 text-danger text-decoration-none"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Profile;