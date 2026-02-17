package com.example.backend.controller;

import com.example.backend.entity.Subscription;
import com.example.backend.entity.User;
import com.example.backend.repository.SubscriptionRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, Long> ids) {
        User follower = userRepository.findById(ids.get("followerId")).orElseThrow();
        User followed = userRepository.findById(ids.get("followedId")).orElseThrow();

        if (!subscriptionRepository.existsByFollowerAndFollowed(follower, followed)) {
            subscriptionRepository.save(new Subscription(follower, followed));
            return ResponseEntity.ok("Suscrito con éxito");
        }
        return ResponseEntity.badRequest().body("Ya estás suscrito");
    }

    @DeleteMapping("/unsubscribe")
    @Transactional // Importante para borrados
    public ResponseEntity<?> unsubscribe(@RequestBody Map<String, Long> ids) {
        User follower = userRepository.findById(ids.get("followerId")).orElseThrow();
        User followed = userRepository.findById(ids.get("followedId")).orElseThrow();

        subscriptionRepository.deleteByFollowerAndFollowed(follower, followed);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check")
    public ResponseEntity<?> check(@RequestParam Long followerId, @RequestParam Long followedId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User followed = userRepository.findById(followedId).orElseThrow();

        boolean exists = subscriptionRepository.existsByFollowerAndFollowed(follower, followed);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
