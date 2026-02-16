import React, { useState, useEffect } from 'react';
import "../pages/create-recipe.css"

function RecipeForm({ recipeId, initialData, onSuccess, onCancel }) {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    publicRecipe: true,
    preparationTime: '',
    ingredients: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        steps: Array.isArray(initialData.steps) ? initialData.steps.join('\n') : initialData.steps || '',
        ingredients: Array.isArray(initialData.ingredients) ? initialData.ingredients.join('\n') : initialData.ingredients || '',
        publicRecipe: initialData.publicRecipe !== false,
        preparationTime: initialData.preparationTime || '',
      });
      if (initialData.imageUrl) {
        setPreviewUrl(initialData.imageUrl);
      }
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('Debes iniciar sesión');

      const recipeDTO = {
        title: formData.title,
        description: formData.description,
        steps: formData.steps,
        ingredients: formData.ingredients,
        preparationTime: parseInt(formData.preparationTime),
        publicRecipe: formData.publicRecipe,
        ownerId: user.id
      };

      const dataToSend = new FormData();
      dataToSend.append('data', new Blob([JSON.stringify(recipeDTO)], {
        type: 'application/json'
      }));

      if (selectedFile) {
        dataToSend.append('file', selectedFile);
      }

      let url = `${process.env.REACT_APP_API_URL}/recipes`;
      let method = 'POST';

      if (recipeId) {
        url = `${url}/${recipeId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al guardar la receta');
      }

      const data = await response.json();
      
      if (onSuccess) onSuccess(data.id);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className='recipe-form'>
        <h1>{recipeId ? 'Editar Receta' : 'Crear Nueva Receta'}</h1>
        
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Título:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label>Descripción:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label>Foto de la receta:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {previewUrl && (
              <div style={{marginTop: '10px'}}>
                <img src={previewUrl} alt="Vista previa" style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '8px'}} />
              </div>
            )}
          </div>

          <div className='form-group'>
            <label>Ingredientes (uno por línea):</label>
            <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows="5" required />
          </div>

          <div className='steps-group'>
            <label>Pasos:</label>
            <textarea name="steps" value={formData.steps} onChange={handleChange} rows="6" required />
          </div>

          <div className='form-group'>
            <label>Tiempo (minutos):</label>
            <input type="number" name="preparationTime" value={formData.preparationTime} onChange={handleChange} min="1" />
          </div>

          <div className='form-group'>
             <label>
              <input type="checkbox" name="publicRecipe" checked={formData.publicRecipe} onChange={handleChange} />
              Receta pública
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Subiendo...' : 'Guardar Receta'}
            </button>
            <button type="button" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RecipeForm;