package com.example.backend.repository;

import com.example.backend.entity.Subscription;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByFollowed(User followed);
    boolean existsByFollowerAndFollowed(User follower, User followed);
    void deleteByFollowerAndFollowed(User follower, User followed);
}
