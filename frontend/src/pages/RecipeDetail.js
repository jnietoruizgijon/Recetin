import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);

    const downloadPDF = () => {
        const input = document.getElementById('printable-area');
        html2canvas(input, { useCORS: true, scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${recipe.title}.pdf`);
        });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/recipes/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(data => setRecipe(data));
    }, [id]);

    useEffect(() => {
        if (!recipe || !recipe.ownerId) return;
        fetch(`${process.env.REACT_APP_API_URL}/users/${recipe.ownerId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(data => setOwner(data));
    }, [recipe]);

    useEffect(() => {
        if (!user) return;

        fetch(`${process.env.REACT_APP_API_URL}/favorites/${user.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(favs => {
                const found = favs.some(f => f.id === Number(id));
                setIsFavorite(found);
            });
    }, [id, user]);

    const toggleFavorite = async () => {
        if (!user) return;
        if (!isFavorite) {
            await fetch(`${process.env.REACT_APP_API_URL}/favorites/${user.id}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user.id })
            });
            setIsFavorite(true);
        } else {
            await fetch(`${process.env.REACT_APP_API_URL}/favorites/${user.id}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            setIsFavorite(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro?")) return;
        await fetch(`${process.env.REACT_APP_API_URL}/recipes/${recipe.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        navigate("/");
    };

    if (!recipe || !owner) return <p>Cargando receta...</p>;
    const isOwner = user && user.id === recipe.ownerId;

    return (
        <main className="container py-5">
            <section className="recipe-detail bg-white shadow-sm rounded-4 overflow-hidden">

                <div className="p-4 p-md-5 border-bottom">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h1 className="display-5 fw-bold mb-2">{recipe.title}</h1>
                            <div className="d-flex align-items-center gap-2 text-muted">
                                {recipe.preparationTime && (
                                    <span className="badge bg-primary rounded-pill">⏱ {recipe.preparationTime} min</span>
                                )}

                                {/* --- AQUÍ RECUPERAMOS EL ENLACE AL DUEÑO --- */}
                                {owner && (
                                    <>
                                        <span>•</span>
                                        <span>
                                            Por
                                            <Link className="fw-bold text-decoration-none ms-1" to={`/user/${owner.id}`}>
                                                {owner.username}
                                            </Link>
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            {user && (
                                <button className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} rounded-pill px-4`} onClick={toggleFavorite}>
                                    {isFavorite ? '❤️ En favoritos' : '🤍 Guardar'}
                                </button>
                            )}
                            {isOwner && (
                                <div className="btn-group">
                                    <button className="btn btn-outline-secondary" onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>✏️ Editar</button>
                                    <button className="btn btn-outline-danger" onClick={handleDelete}>🗑️ Eliminar</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div id="printable-area" className="bg-white">
                    <div className="recipe-hero">
                        <img
                            src={recipe.imageUrl}
                            className="img-fluid w-100"
                            alt={recipe.title}
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                        />
                    </div>

                    <div className="p-4 p-md-5">
                        <h2 className="fw-bold mb-4">{recipe.title}</h2>
                        <div className="row g-5">
                            <div className="col-lg-8">
                                {/* DESCRIPCIÓN */}
                                <div className="mb-5">
                                    <h3 className="h4 fw-bold border-start border-primary border-4 ps-3 mb-3 text-primary">Descripción</h3>
                                    <p className="lead text-muted">{recipe.description}</p>
                                </div>

                                {recipe.ingredients && (
                                    <div className="mb-5">
                                        <h3 className="h4 fw-bold border-start border-primary border-4 ps-3 mb-4 text-primary">Ingredientes</h3>
                                        <ul className="list-group list-group-flush">
                                            {recipe.ingredients.split('\n')
                                                .filter(i => i.trim() !== '')
                                                .map((ing, index) => (
                                                    <li className="list-group-item px-0 py-2 bg-transparent" key={index}>
                                                        <span className="text-primary me-2">✔</span> {ing}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )}

                                {recipe.steps && (
                                    <div className="mb-4">
                                        <h3 className="h4 fw-bold border-start border-primary border-4 ps-3 mb-4 text-primary">Preparación</h3>
                                        {recipe.steps.split('\n')
                                            .filter(s => s.trim() !== '')
                                            .map((step, index) => (
                                                <div className="d-flex mb-4 gap-3" key={index}>
                                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                        style={{ width: '32px', height: '32px' }}>
                                                        {index + 1}
                                                    </div>
                                                    <p className="mb-0 fs-5">{step}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. BOTÓN DE DESCARGA */}
                <div className="p-4 border-top text-center bg-light">
                    <button onClick={downloadPDF} className="btn btn-dark btn-lg rounded-pill px-5 shadow">
                        📥 Descargar receta en PDF
                    </button>
                </div>
            </section>
        </main>
    );
}

export default RecipeDetail;