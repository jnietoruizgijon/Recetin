import React, { useContext } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RecipeForm from '../components/RecipeForm';

function CreateRecipe() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <RecipeForm
      onSuccess={(newRecipeId) => navigate(`/recipes/${newRecipeId}`)}
      onCancel={() => navigate(-1)}  // Esto lo que hace es llevarte a donde estabas antes
    />
  );
}

export default CreateRecipe;
