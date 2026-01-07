package com.example.backend.controller.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRecipeRequest {

    private String title;
    private String description;
    private String steps;
    private boolean publicRecipe;
    private String ingredients;
    private String imageUrl;
    private Integer preparationTime;
    private Long ownerId;
}
