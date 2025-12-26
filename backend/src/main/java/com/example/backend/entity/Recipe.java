package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "recipes")
@Getter
@Setter
@NoArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String steps;

    @Column(nullable = false)
    private boolean publicRecipe;

    private String imageUrl;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @JsonIgnore // Para que no muestre el objeto owner entero
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getOwnerId() { // Este metodo se hace para que en el Json aparezca directamente el ownerId, no el owner entero
        return owner != null ? owner.getId() : null;
    }
}
