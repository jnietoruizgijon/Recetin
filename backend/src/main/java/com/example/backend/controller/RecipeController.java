package com.example.backend.controller;

import com.example.backend.controller.dto.CreateRecipeRequest;
import com.example.backend.controller.dto.UpdateRecipeRequest;
import com.example.backend.entity.Recipe;
import com.example.backend.entity.User;
import com.example.backend.repository.FavoriteRepository;
import com.example.backend.repository.RecipeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CloudinaryService;
import com.example.backend.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private RecipeService recipeService;

    public RecipeController(RecipeRepository recipeRepository, UserRepository userRepository, FavoriteRepository favoriteRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @GetMapping
    public List<Recipe> getPublicRecipes() {
        return recipeRepository.findByPublicRecipeTrueOrderByIdAsc();
    }

    @GetMapping("/{id}")
    public Recipe getRecipe(@PathVariable Long id) {
        return recipeRepository.findById(id).orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    @GetMapping("/user/{userId}")
    public List<Recipe> getRecipesByUser(@PathVariable Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        return recipeRepository.findByOwner(user);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Recipe> createRecipe(
            @RequestPart("data") CreateRecipeRequest request, // El JSON viene aquí
            @RequestPart(value = "file", required = false) MultipartFile file // La foto aquí
    ) throws IOException {
        Recipe newRecipe = recipeService.createRecipeWithImage(request, file);
        return ResponseEntity.ok(newRecipe);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Recipe> updateRecipe(
            @PathVariable Long id,
            @RequestPart("data") UpdateRecipeRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        Recipe updatedRecipe = recipeService.updateRecipeWithImage(id, request, file);
        return ResponseEntity.ok(updatedRecipe);
    }

    @DeleteMapping("/{id}")
    public void deleteRecipe(@PathVariable Long id) {

        Recipe recipe = recipeRepository.findById(id).orElseThrow(() -> new RuntimeException("Recipe not found"));

        recipeRepository.deleteById(id);
    }
}
