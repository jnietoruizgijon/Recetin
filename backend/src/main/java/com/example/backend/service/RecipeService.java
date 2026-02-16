package com.example.backend.service;

import com.example.backend.controller.dto.CreateRecipeRequest;
import com.example.backend.controller.dto.UpdateRecipeRequest;
import com.example.backend.entity.Recipe;
import com.example.backend.entity.User;
import com.example.backend.repository.RecipeRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService; // Tu servicio de fotos

    // Lógica para CREAR
    public Recipe createRecipeWithImage(CreateRecipeRequest request, MultipartFile file) throws IOException {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recipe recipe = new Recipe();
        // Mapeamos los campos
        mapRequestToRecipe(recipe, request);
        recipe.setOwner(owner);

        // Si hay foto, la subimos
        if (file != null && !file.isEmpty()) {
            Map result = cloudinaryService.upload(file);
            recipe.setImageUrl((String) result.get("secure_url"));
        }

        return recipeRepository.save(recipe);
    }

    // Lógica para ACTUALIZAR
    public Recipe updateRecipeWithImage(Long id, UpdateRecipeRequest request, MultipartFile file) throws IOException {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        // Mapeamos los campos comunes
        mapRequestToRecipe(recipe, request);

        // Si suben una NUEVA foto, la reemplazamos. Si es null, mantenemos la vieja.
        if (file != null && !file.isEmpty()) {
            Map result = cloudinaryService.upload(file);
            recipe.setImageUrl((String) result.get("secure_url"));
        }

        return recipeRepository.save(recipe);
    }

    // Método auxiliar para no repetir código (DRY)
    private void mapRequestToRecipe(Recipe recipe, CreateRecipeRequest request) { // O usa una interfaz común si puedes
        recipe.setTitle(request.getTitle());
        recipe.setDescription(request.getDescription());
        recipe.setSteps(request.getSteps());
        recipe.setPublicRecipe(request.isPublicRecipe());
        recipe.setIngredients(request.getIngredients());
        recipe.setPreparationTime(request.getPreparationTime());
        // NO seteamos imageUrl aquí, eso va aparte
    }

    // Sobrecarga para UpdateRecipeRequest si no comparten clase padre
    private void mapRequestToRecipe(Recipe recipe, UpdateRecipeRequest request) {
        recipe.setTitle(request.getTitle());
        recipe.setDescription(request.getDescription());
        recipe.setSteps(request.getSteps());
        recipe.setPublicRecipe(request.isPublicRecipe());
        recipe.setIngredients(request.getIngredients());
        recipe.setPreparationTime(request.getPreparationTime());
    }
}