package com.example.backend.controller;

import com.example.backend.entity.Favorite;
import com.example.backend.entity.Recipe;
import com.example.backend.entity.User;
import com.example.backend.repository.FavoriteRepository;
import com.example.backend.repository.RecipeRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public FavoriteController(
            FavoriteRepository favoriteRepository,
            UserRepository userRepository,
            RecipeRepository recipeRepository
    ) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
    }

    @PostMapping("/{userId}/{recipeId}")
    public void addFavorite(@PathVariable Long userId, @PathVariable Long recipeId) {

        if (favoriteRepository.findByUserIdAndRecipeId(userId, recipeId).isPresent()) {
            return; // ya existe → no hacemos nada
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setRecipe(recipe);

        favoriteRepository.save(favorite);
    }

    @DeleteMapping("/{userId}/{recipeId}")
    public void removeFavorite(@PathVariable Long userId, @PathVariable Long recipeId) {

        favoriteRepository.findByUserIdAndRecipeId(userId, recipeId)
                .ifPresent(favoriteRepository::delete);
    }

    @GetMapping("/{userId}")
    public List<Recipe> getUserFavorites(@PathVariable Long userId) {
        return favoriteRepository.findByUserId(userId).stream().map(Favorite::getRecipe).toList();
    }
}

