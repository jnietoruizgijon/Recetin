import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./recipes.css"
import plus from "../img/plus-solid-full.svg"

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState('none');
  const [search, setSearch] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

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
      const response = await fetch(`${API_URL}/recipes`);
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
    <>
      <input
        type="text"
        placeholder="Buscar receta..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="none">Sin ordenar</option>
        <option value="ingredients">Cantidad de ingredientes</option>
        <option value="time">Tiempo de preparación</option>
      </select>
      <p>
        Ordenado por:{' '}
        {sortBy === 'ingredients' && 'Ingredientes'}
        {sortBy === 'time' && 'Tiempo'}
        {sortBy === 'none' && 'Sin ordenar'}
      </p>

      <main>

        <section className='recipes'>
          <div className='recipes__container'>
            {/* Card para Añadir Receta (solo si hay usuario logueado) */}
            {user && (
              <Link to="/recipes/new" className='card create-card'>
                <div className='create-card__content'>
                  <img src={plus} />
                  <p>Añadir receta</p>
                </div>
              </Link>
            )}

            {/* Cards de recetas existentes */}
            {sortedRecipes.length === 0 ? (
              <p>No se encontraron recetas</p>
            ) : (sortedRecipes.map(recipe => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`} className='card'>
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
            )))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;