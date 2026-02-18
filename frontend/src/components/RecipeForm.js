import React, { useState, useEffect } from 'react';

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
      const token = localStorage.getItem("token");
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
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
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
    <main className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          {/* TARJETA SOMBREADA */}
          <div className="card shadow">
            <div className="card-body p-4">

              <h2 className="card-title text-center mb-4">
                {recipeId ? '✏️ Editar Receta' : '🍳 Crear Nueva Receta'}
              </h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* TÍTULO */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Título de la receta</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="Ej: Tortilla de patatas"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* DESCRIPCIÓN */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Descripción corta</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* FOTO */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Foto del plato</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewUrl && (
                    <div className="mt-3 text-center">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="img-thumbnail rounded"
                        style={{ maxHeight: '250px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>

                {/* INGREDIENTES */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Ingredientes <small className="text-muted fw-normal">(uno por línea)</small></label>
                  <textarea
                    className="form-control"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Ej:&#10;4 Huevos&#10;1kg Patatas&#10;Sal"
                    required
                  />
                </div>

                {/* PASOS */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Pasos de preparación</label>
                  <textarea
                    className="form-control"
                    name="steps"
                    value={formData.steps}
                    onChange={handleChange}
                    rows="6"
                    required
                  />
                </div>

                {/* GRUPO: TIEMPO Y CHECKBOX (En la misma fila) */}
                <div className="row mb-4 align-items-center">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Tiempo (minutos)</label>
                    <div className="input-group">
                      <span className="input-group-text">⏱</span>
                      <input
                        type="number"
                        className="form-control"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mt-3 mt-md-0">
                    <div
                      className="form-check form-switch p-3 border rounded bg-light d-flex align-items-center justify-content-center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleChange({ target: { name: 'publicRecipe', type: 'checkbox', checked: !formData.publicRecipe } })}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="publicCheck"
                        name="publicRecipe"
                        checked={formData.publicRecipe}
                        onChange={handleChange}
                        // Estos estilos resetean el posicionamiento extraño de Bootstrap
                        style={{
                          cursor: 'pointer',
                          float: 'none',
                          margin: '0',
                          position: 'static'
                        }}
                      />
                      <label
                        className="form-check-label ms-3 fw-medium mb-0"
                        htmlFor="publicCheck"
                        style={{ cursor: 'pointer' }}
                      >
                        Hacer pública la receta
                      </label>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end border-top pt-3">
                  <button type="button" className="btn btn-outline-secondary me-md-2" onClick={onCancel}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Subiendo...
                      </>
                    ) : (
                      'Guardar Receta'
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RecipeForm;