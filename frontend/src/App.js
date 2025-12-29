import { useEffect, useState } from "react";

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Recetín</h1>

      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            {recipe.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

