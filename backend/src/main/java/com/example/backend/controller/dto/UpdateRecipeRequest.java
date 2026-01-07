package com.example.backend.controller.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRecipeRequest {

    private String title;
    private String description;
    private String steps;
    private boolean publicRecipe;
    private String ingredients;
    private String imageUrl;
    private Integer preparationTime;
}
