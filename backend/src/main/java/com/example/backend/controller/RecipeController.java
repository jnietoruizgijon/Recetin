package com.example.backend.controller;

import com.example.backend.controller.dto.CreateRecipeRequest;
import com.example.backend.entity.Recipe;
import com.example.backend.entity.User;
import com.example.backend.repository.RecipeRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public RecipeController(RecipeRepository recipeRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
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
}
