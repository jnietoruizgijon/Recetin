package com.example.backend.controller;

import com.example.backend.controller.dto.CreateRecipeRequest;
import com.example.backend.controller.dto.UpdateRecipeRequest;
import com.example.backend.entity.Recipe;
import com.example.backend.entity.User;
import com.example.backend.repository.FavoriteRepository;
import com.example.backend.repository.RecipeRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;

    public RecipeController(RecipeRepository recipeRepository, UserRepository userRepository, FavoriteRepository favoriteRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @GetMapping("/recipes")
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @PostMapping("/recipes")
    public Recipe createRecipe(@RequestBody CreateRecipeRequest request) {
        User owner = userRepository.findById(request.getOwnerId()).orElseThrow(() -> new RuntimeException("User not found"));

        Recipe recipe = new Recipe();
        recipe.setTitle(request.getTitle());
        recipe.setDescription(request.getDescription());
        recipe.setSteps(request.getSteps());
        recipe.setPublicRecipe(request.isPublicRecipe());
        recipe.setOwner(owner);

        return recipeRepository.save(recipe);
    }

    @PutMapping("/recipes/{id}")
    public Recipe updateRecipe (@PathVariable Long id, @RequestBody UpdateRecipeRequest request) {

        Recipe recipe = recipeRepository.findById(id).orElseThrow(() -> new RuntimeException("Recipe not found"));

        recipe.setTitle(request.getTitle());
        recipe.setDescription(request.getDescription());
        recipe.setSteps(request.getSteps());
        recipe.setPublicRecipe(request.isPublicRecipe());

        return recipeRepository.save(recipe);
    }

    @DeleteMapping("/recipes/{id}")
    public void deleteRecipe(@PathVariable Long id) {

        if (!recipeRepository.existsById(id)) {
            throw new RuntimeException("Recipe not found");
        }

        recipeRepository.deleteById(id);
    }
}
