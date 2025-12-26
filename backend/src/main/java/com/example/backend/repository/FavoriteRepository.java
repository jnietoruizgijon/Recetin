package com.example.backend.repository;

import com.example.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserIdAndRecipeId(Long userId, Long recipeId);

    List<Favorite> findByUserId(Long userId);

    void deleteByRecipeId(Long recipeId);
}
