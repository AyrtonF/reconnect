package com.nassau.reconnect.models;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "coupons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String image;

    @Column(length = 1000)
    private String description;

    private Integer scoreRequired;

    private LocalDateTime validUntil;

    @ManyToMany(mappedBy = "coupons")
    private Set<User> redeemedBy = new HashSet<>();
}