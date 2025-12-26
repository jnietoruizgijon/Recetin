package com.example.backend;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataTestRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final FavoriteRepository favoriteRepository;

    public DataTestRunner(
            UserRepository userRepository,
            RecipeRepository recipeRepository,
            FavoriteRepository favoriteRepository
    ) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public void run(String... args) {

        // 1️⃣ Crear usuario
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setPassword("1234");
        user.setRole(Role.USER);

        user = userRepository.save(user);
        System.out.println("User guardado con id: " + user.getId());

        // 2️⃣ Crear receta
        Recipe recipe = new Recipe();
        recipe.setTitle("Pasta simple");
        recipe.setDescription("Una receta de prueba");
        recipe.setSteps("1. Hervir agua\n2. Cocer pasta\n3. Servir");
        recipe.setPublicRecipe(true);
        recipe.setOwner(user);

        recipe = recipeRepository.save(recipe);
        System.out.println("Recipe guardada con id: " + recipe.getId());

        // 3️⃣ Crear favorito
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setRecipe(recipe);

        favorite = favoriteRepository.save(favorite);
        System.out.println("Favorite guardado con id: " + favorite.getId());
    }
}
