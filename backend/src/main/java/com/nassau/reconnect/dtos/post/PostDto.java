package com.nassau.reconnect.dtos.post;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Long familyId;
    private String caption;
    private String image;
    private Integer likes;
    private LocalDateTime timestamp;
}