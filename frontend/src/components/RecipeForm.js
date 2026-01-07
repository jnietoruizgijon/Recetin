import React, { useState, useEffect } from 'react';
import "../pages/create-recipe.css"

function RecipeForm({ recipeId, initialData, onSuccess, onCancel }) {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    publicRecipe: true,
    imageUrl: '',
    preparationTime: '',
    ingredients: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si estamos editando, cargamos los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        steps: initialData.steps || '',
        publicRecipe: initialData.publicRecipe !== false,
        imageUrl: initialData.imageUrl || '',
        preparationTime: initialData.preparationTime || '',
        ingredients: initialData.ingredients || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('Debes iniciar sesión');
      }

      const recipeWithOwner = {
        ...formData,
        ownerId: user.id
      };

      let url = 'http://localhost:8080/recipes';
      let method = 'POST';

      if (recipeId) {
        url = `http://localhost:8080/recipes/${recipeId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeWithOwner)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la receta');
      }

      const data = await response.json();

      if (onSuccess) {
        onSuccess(data.id);
      }


    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className='recipe-form'>

        <h1>{recipeId ? 'Editar Receta' : 'Crear Nueva Receta'}</h1>

        {error && <div>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label>Ingredientes (uno por línea)</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows="5"
              placeholder="2 huevos&#10;200g harina&#10;Leche"
              required
            />
          </div>


          <div className='steps-group'>
            <label>Pasos (instrucciones):</label>
            <textarea
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              rows="6"
              required
              placeholder='Mezclar ingredientes&#10;Añadir al molde&#10;Hornear'
            />
          </div>

          <div className='form-group'>
            <label>Tiempo de preparación (minutos):</label>
            <input
              type="number"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className='form-group'>
            <label>
              <input
                type="checkbox"
                name="publicRecipe"
                checked={formData.publicRecipe}
                onChange={handleChange}
              />
              Receta pública
            </label>
          </div>

          <div>
            <label>URL de imagen (opcional):</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (recipeId ? 'Actualizar Receta' : 'Crear Receta')}
            </button>
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RecipeForm;