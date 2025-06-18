package com.nassau.reconnect.models;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "families")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToMany(mappedBy = "families")
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "family")
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "family")
    private List<Challenge> challenges = new ArrayList<>();
}
