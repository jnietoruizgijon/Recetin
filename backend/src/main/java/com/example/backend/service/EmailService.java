package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Async
    public void sendNewRecipeEmail(String toEmail, String chefName, String recipeTitle, Long recipeId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("juan.nieto-acosta@iesruizgijon.com");
        message.setTo(toEmail);
        message.setSubject("¡Nueva receta de " + chefName + "!");

        String recipeUrl = frontendUrl + "/recipes/" + recipeId;

        String body = "Hola,\n\n" +
                chefName + " ha publicado una nueva receta: " + recipeTitle + ".\n" +
                "¡Entra a verla y cuéntanos qué te parece!\n\n" +
                "Ver receta aquí: " + recipeUrl + "\n\n" +
                "¡Buen provecho!\nEl equipo de Recetín";

        message.setText(body);
        mailSender.send(message);
    }
}
