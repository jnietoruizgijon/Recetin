package com.example.backend.controller.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {

    private String username;
    private String email;
    private String password;
}
