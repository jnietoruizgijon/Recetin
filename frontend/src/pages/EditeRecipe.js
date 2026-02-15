import React, { useState, useEffect, useContext } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RecipeForm from '../components/RecipeForm';

function EditRecipe() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/recipes/${id}`);
      if (!response.ok) throw new Error('Receta no encontrada');
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate(`/recipes/${id}`);
  };

  if (!user) return <Navigate to="/login" />;

  if (loading) return <div>Cargando...</div>;

  if (error) return <div>Error: {error}</div>;

  if (user.id !== recipe.ownerId) {
    return <div>No tienes permiso para editar esta receta</div>;
  }

  return <RecipeForm recipeId={id} initialData={recipe} onSuccess={handleSuccess} onCancel={() => navigate(`/recipes/${id}`)}/>;
}

export default EditRecipe;