import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);


    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/recipes/${id}`)
            .then(res => res.json())
            .then(data => setRecipe(data));
    }, [id]);

    useEffect(() => {
        if (!recipe || !recipe.ownerId) return;
        fetch(`${process.env.REACT_APP_API_URL}/users/${recipe.ownerId}`)
            .then(res => res.json())
            .then(data => setOwner(data));
    }, [recipe]);

    useEffect(() => {
        if (!user) return;

        fetch(`${process.env.REACT_APP_API_URL}/favorites/${user.id}`)
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
            await fetch(`${process.env.REACT_APP_API_URL}/favorites/${user.id}/${id}`, {
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
            await fetch(`${process.env.REACT_APP_API_URL}/favorites/${user.id}/${id}`, {
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

        await fetch(`${process.env.REACT_APP_API_URL}/recipes/${recipe.id}`, {
            method: "DELETE"
        });

        navigate("/");
    };


    if (!recipe || !owner) {
        return <p>Cargando receta...</p>;
    }

    const isOwner = user && user.id === recipe.ownerId;

    return (
        <main className="container py-5">
            <section className="recipe-detail bg-white shadow-sm rounded-4 overflow-hidden">

                {/* 1. CABECERA CON TÍTULO Y ACCIONES */}
                <div className="p-4 p-md-5 border-bottom">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 className="display-5 fw-bold mb-2">{recipe.title}</h1>
                            <div className="d-flex align-items-center gap-2 text-muted">
                                {recipe.preparationTime ? (
                                    <span className="badge bg-primary rounded-pill">⏱ {recipe.preparationTime} min</span>
                                ) : null}
                                {owner && user && owner.id !== user.id ? (
                                    <><span>•</span>
                                        <span>
                                            Por 
                                            <Link className="fw-bold text-decoration-none" to={`/user/${owner.id}`}>
                                                {" " + owner.username}
                                            </Link>
                                        </span>
                                    </>
                                ) : null}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            {user && (
                                <button
                                    className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} rounded-pill px-4 shadow-sm`}
                                    onClick={toggleFavorite}
                                >
                                    {isFavorite ? '❤️ En favoritos' : '🤍 Guardar'}
                                </button>
                            )}

                            {isOwner && (
                                <div className="btn-group">
                                    <button className="btn btn-outline-secondary rounded-start-pill" onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="btn btn-outline-danger rounded-end-pill" onClick={handleDelete}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {!user && (
                        <p className="small text-muted mt-2 mb-0 italic">Inicia sesión para añadir a favoritos</p>
                    )}
                </div>

                {/* 2. IMAGEN PRINCIPAL */}
                <div className="recipe-hero">
                    <img
                        src={recipe.imageUrl}
                        className="img-fluid w-100"
                        alt={recipe.title}
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                    />
                </div>

                <div className="p-4 p-md-5">
                    <div className="row g-5">

                        {/* 3. COLUMNA IZQUIERDA: DESCRIPCIÓN Y PREPARACIÓN */}
                        <div className="col-lg-8">
                            <div className="mb-5">
                                <h3 className="h4 fw-bold border-start border-primary border-4 ps-3 mb-3">Descripción</h3>
                                <p className="lead text-muted">{recipe.description}</p>
                            </div>
                        </div>

                        {/* SECCIÓN DE INGREDIENTES */}
                        {recipe.ingredients ? (
                            <div className="mb-4">
                                <h3 className="h4 fw-bold border-start border-primary border-4 ps-3 mb-4 text-primary">
                                    Ingredientes
                                </h3>
                                <ul className="list-group list-group-flush bg-transparent">
                                    {recipe.ingredients.split('\n')
                                        .filter(i => i && i.trim() !== '') // Evita líneas vacías
                                        .map((ingredient, index) => (
                                            <li className="list-group-item bg-transparent border-bottom px-0 py-3 d-flex align-items-center" key={index}>
                                                <span className="me-2 text-primary">✔</span> {ingredient}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        ) : (
                            <p className="text-muted italic">Esta receta no tiene ingredientes especificados.</p>
                        )}

                        {/* SECCIÓN DE PASOS */}
                        {recipe.steps ? (
                            <div>
                                <h3 className="h4 fw-bold border-start border-primary border-4 ps-3 mb-4 text-primary">
                                    Preparación
                                </h3>
                                <div className="steps-list">
                                    {recipe.steps.split('\n')
                                        .filter(step => step && step.trim() !== '')
                                        .map((step, index) => (
                                            <div className="d-flex mb-4 gap-3" key={index}>
                                                <div className="step-number bg-primary text-white rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center fw-bold"
                                                    style={{ width: '32px', height: '32px' }}>
                                                    {index + 1}
                                                </div>
                                                <p className="mb-0 pt-1 fs-5">{step}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted">No se han detallado los pasos de preparación.</p>
                        )}

                    </div>
                </div>
            </section>
        </main>
    );
}

export default RecipeDetail;
