package com.example.backend.repository;

import com.example.backend.entity.Recipe;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByOwner(User owner);

    List<Recipe> findByPublicRecipeTrue();
}
