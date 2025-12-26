package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore // Esta anotación es para que a la hora de que el REST mande los datos no se mande la pass
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Para que JPA guarde un String en la DB
    @Column(nullable = false)
    private Role role;

}
