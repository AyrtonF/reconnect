package com.nassau.reconnect.models;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "text_materials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @Column(nullable = false)
    private String title;

    @Column(length = 10000)
    private String content;

    private Integer estimatedReadTime;

    private boolean isRead;

    @ElementCollection
    @CollectionTable(
            name = "text_material_attachments",
            joinColumns = @JoinColumn(name = "material_id")
    )
    private List<Attachment> attachments = new ArrayList<>();

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Attachment {
        private String name;
        private String url;
        private String type;
    }
}