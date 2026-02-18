import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import plus from "../img/plus-solid-full.svg"

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState('none');
  const [search, setSearch] = useState('');


  useEffect(() => {
    fetchRecipes();
  }, []);

  const countIngredients = (ingredients) => ingredients ? ingredients.split('\n').filter(i => i.trim() !== '').length : 0;
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedRecipes = [...filteredRecipes];

  if (sortBy === 'ingredients') {
    sortedRecipes.sort(
      (a, b) => countIngredients(a.ingredients) - countIngredients(b.ingredients)
    );
  }

  if (sortBy === 'time') {
    sortedRecipes.sort(
      (a, b) =>
        (a.preparationTime ?? Infinity) -
        (b.preparationTime ?? Infinity)
    );
  }




  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/recipes`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error('Error al cargar recetas');
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container py-4">
      {/* 1. SECCIÓN DE FILTROS Y BÚSQUEDA */}
      <div className="row g-3 mb-5 align-items-end">
        <div className="col-12 col-md-6">
          <label className="form-label fw-bold">Buscar</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">🔍</span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Busca una receta deliciosa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">Ordenar por</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="none">Sin ordenar</option>
            <option value="ingredients">Cantidad de ingredientes</option>
            <option value="time">Tiempo de preparación</option>
          </select>
        </div>

        <div className="col-12 col-md-2 text-md-end">
          <small className="text-muted d-block mb-2">
            {sortBy !== 'none' && (
              <span>
                Ordenado por: <strong>{sortBy === 'ingredients' ? 'Ingredientes' : 'Tiempo'}</strong>
              </span>
            )}
          </small>
        </div>
      </div>

      {/* 2. GRID DE RECETAS */}
      <div className="row g-4">
        {/* Card especial para añadir receta (Botón creativo) */}
        {user && (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link
              to="/recipes/new"
              className="card h-100 border-dashed d-flex align-items-center justify-content-center text-decoration-none bg-light text-primary"
              style={{ border: '2px dashed #0d6efd', minHeight: '250px', transition: 'all 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <div className="text-center p-4">
                <div className="display-4 mb-2">➕</div>
                <p className="fw-bold mb-0">Añadir nueva receta</p>
              </div>
            </Link>
          </div>
        )}

        {/* Listado de recetas */}
        {sortedRecipes.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-light text-center py-5 border">
              <p className="mb-0 fs-5 text-muted">No hemos encontrado recetas que coincidan con tu búsqueda 🥣</p>
            </div>
          </div>
        ) : (
          sortedRecipes.map(recipe => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={recipe.id}>
              <Link
                to={`/recipes/${recipe.id}`}
                className="card h-100 text-decoration-none text-dark shadow-sm border-0 overflow-hidden card-hover"
                style={{ transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    className="card-img-top"
                    alt={recipe.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
                    <span className="text-muted">Sin imagen</span>
                  </div>
                )}

                <div className="card-body">
                  <h5 className="card-title fw-bold text-truncate">{recipe.title}</h5>
                  {recipe.preparationTime ? (
                    <p className="card-text text-muted small" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      Tiempo de preparación: {recipe.preparationTime} mins
                    </p>
                  ) : ""}
                </div>

                <div className="card-footer bg-white border-0 pb-3">
                  <span className="btn btn-outline-primary btn-sm w-100 rounded-pill">Ver receta</span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;