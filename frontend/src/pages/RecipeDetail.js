import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./show.css"


function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;



    useEffect(() => {
        fetch(`API_URL/recipes/${id}`)
            .then(res => res.json())
            .then(data => setRecipe(data));
    }, [id]);

    useEffect(() => {
        if (!user) return;

        fetch(`API_URL/favorites/${user.id}`)
            .then(res => res.json())
            .then(favs => {
                const found = favs.some(f => f.id === Number(id));
                setIsFavorite(found);
            });
    }, [id, user]);

    const toggleFavorite = async () => {
        if (!user) return;

        if (!isFavorite) {
            // añadir
            await fetch(`API_URL/favorites/${user.id}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.id
                })
            });
            setIsFavorite(true);
        } else {
            // quitar
            await fetch(`API_URL/favorites/${user.id}/${id}`, {
                method: "DELETE"
            });
            setIsFavorite(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "¿Estás seguro de que quieres eliminar esta receta?"
        );

        if (!confirmDelete) return;

        await fetch(`API_URL/recipes/${recipe.id}`, {
            method: "DELETE"
        });

        navigate("/");
    };


    if (!recipe) {
        return <p>Cargando receta...</p>;
    }

    const isOwner = user && user.id === recipe.ownerId;

    return (
        <main>
            <section className="recipe">
                <div className="recipe-header">
                    <h1 className="recipe-title">{recipe.title}</h1>
                    <div className="recipe-actions">
                        {user && (
                            <button className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`} onClick={toggleFavorite}>
                                ❤
                            </button>
                        )}

                        {!user && (
                            <p>Inicia sesión para añadir a favoritos</p>
                        )}

                        {isOwner && (
                            <>
                                <button onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>
                                    ✏️ Editar
                                </button>

                                <button
                                    onClick={handleDelete}
                                >
                                    🗑️ Eliminar
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <img src={recipe.imageUrl}></img>
                <h3>Tiempo de preparación: {recipe.preparationTime}</h3>
                <p>Descripción: {recipe.description}</p>
                {recipe.ingredients && (
                    <>
                        <h3 className="recipe__section-title">Ingredientes</h3>
                        <ul>
                            {recipe.ingredients
                                .split('\n')
                                .filter(i => i.trim() !== '')
                                .map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                        </ul>
                    </>
                )}

                <h3 className="recipe__section-title">Preparación</h3>
                <ol>
                    {recipe.steps.split('\n').filter(step => step.trim() !== '').map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>



            </section>
        </main>
    );
}

export default RecipeDetail;
