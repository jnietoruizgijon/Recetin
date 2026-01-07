import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./user.css"
import plus from "../img/plus-solid-full.svg"


function Profile() {
    const { user } = useContext(AuthContext);

    const [myRecipes, setMyRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadProfileData();
        }
    }, [user]);

    const loadProfileData = async () => {
        try {
            setLoading(true);

            const recipesResponse = await fetch(`API_URL/recipes/user/${user.id}`);
            const favoritesResponse = await fetch(`API_URL/favorites/${user.id}`);

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
                `API_URL/favorites/${user.id}/${recipeId}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
            }
        } catch (err) {
            console.error('Error al eliminar favorito:', err);
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
        <main className='main'>
            <h1>Perfil de {user.username}</h1>

            {/* Sección 1: Mis Recetas */}
            <div className='user-recipes'>
                <section className='recipes-section'>
                    <h2>Mis Recetas Creadas</h2>
                    <div className='recipes-grid'>
                        <Link to="/recipes/new" className='card create-card'>
                            <div className='create-card__content'>
                                <img src={plus} />
                                <p>Añadir receta</p>
                            </div>
                        </Link>
                        {myRecipes.length === 0 ? (
                            <p>No has creado ninguna receta aún.</p>
                        ) : (
                            <>
                                {myRecipes.map(recipe => (
                                    <Link key={recipe.id} to={`/recipes/${recipe.id}`} className='card recipe-card'>
                                        {recipe.imageUrl && (
                                            <img
                                                src={recipe.imageUrl}
                                                alt={recipe.title}
                                            />
                                        )}
                                        <div>
                                            <h3>{recipe.title}</h3>
                                            <p>{recipe.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>
                </section>
            </div>

            {/* Sección 2: Mis Favoritos */}
            <div>
                <h2>Mis Recetas Favoritas</h2>
                {favorites.length === 0 ? (
                    <p>No tienes recetas favoritas aún.</p>
                ) : (
                    <div>
                        {favorites.map(recipe => (
                            <div key={recipe.id}>
                                <h3>{recipe.title}</h3>
                                <p>{recipe.description}</p>
                                <div>
                                    <Link to={`/recipes/${recipe.id}`}>Ver receta</Link>
                                    <button onClick={() => handleRemoveFavorite(recipe.id)}>
                                        Quitar de favoritos
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Profile;