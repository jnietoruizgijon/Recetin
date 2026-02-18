import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function UserDetail() {
    const { id } = useParams(); // ID del chef visitado
    const [chef, setChef] = useState(null); // El dueño del perfil
    const [recipes, setRecipes] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const token = localStorage.getItem("token");

    // Recuperamos al usuario logueado (TÚ) desde el localStorage
    const me = JSON.parse(localStorage.getItem("user"));

    // 1. Cargar datos del Chef
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(data => setChef(data));
    }, [id]);

    // 2. Comprobar si ya estoy suscrito
    useEffect(() => {
        const checkStatus = async () => {
            // Solo comprobamos si yo estoy logueado y el chef ha cargado
            if (!me || !chef) return;
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/subscriptions/check?followerId=${me.id}&followedId=${chef.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setIsSubscribed(data.exists);
            } catch (error) {
                console.error("Error al verificar suscripción", error);
            }
        };
        checkStatus();
    }, [chef, me?.id]); // me?.id por si no hay usuario logueado

    // 3. Cargar recetas del Chef
    useEffect(() => {
        if (!chef) return;
        fetch(`${process.env.REACT_APP_API_URL}/recipes/user/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(data => setRecipes(data));
    }, [chef, id]);

    const handleSubscription = async () => {
        if (!me) {
            alert("Debes estar logueado para seguir a un chef");
            return;
        }

        const endpoint = isSubscribed ? '/unsubscribe' : '/subscribe';
        const method = isSubscribed ? 'DELETE' : 'POST';

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/subscriptions${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    followerId: me.id, // Tu ID (el que sigue)
                    followedId: chef.id // El ID del chef (al que siguen)
                })
            });

            if (response.ok) {
                setIsSubscribed(!isSubscribed);
            }
        } catch (err) {
            console.error("Fallo en la suscripción", err);
        }
    };

    if (!chef) return <div className="container py-5">Cargando perfil...</div>;

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0 mb-5 rounded-3">
                <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fs-4 fw-bold"
                                style={{ width: '60px', height: '60px' }}>
                                {chef.username ? chef.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <h1 className="h2 mb-0 fw-bold">{chef.username}</h1>
                                <small className="text-muted">Chef en Recetín</small>
                            </div>
                        </div>

                        {/* No mostrar el botón si soy yo mismo viendo mi perfil */}
                        {me && me.id !== chef.id && (
                            <button
                                className={`btn ${isSubscribed ? 'btn-outline-secondary' : 'btn-primary'} rounded-pill px-4 shadow-sm fw-bold`}
                                onClick={handleSubscription}
                            >
                                {isSubscribed ? (
                                    <span><i className="bi bi-check-lg me-1"></i> Suscrito</span>
                                ) : (
                                    <span><i className="bi bi-plus-lg me-1"></i> Suscribirse</span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid de recetas igual que lo tenías... */}
            <div className="row g-4">
                {recipes.map(recipe => (
                    <div className="col-12 col-md-6 col-lg-4" key={recipe.id}>
                        <Link to={`/recipes/${recipe.id}`} className="card h-100 text-decoration-none text-dark border-0 shadow-sm card-hover">
                            <img src={recipe.imageUrl} className="card-img-top" alt={recipe.title} style={{ height: "220px", objectFit: "cover" }} />
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-3">{recipe.title}</h5>
                                <div className="btn btn-primary mt-auto w-100 rounded-pill">Ver Receta</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserDetail;