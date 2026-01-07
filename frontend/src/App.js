import { BrowserRouter, Routes, Router, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeDetail from "./pages/RecipeDetail";
import Profile from "./pages/Profile";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditeRecipe";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/recipes/:id" element={<RecipeDetail />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/recipes/new" element={<CreateRecipe />}/>
        <Route path="/recipes/edit/:id" element={<EditRecipe />}/>
      </Routes>
    </BrowserRouter>
  );

}

export default App;

