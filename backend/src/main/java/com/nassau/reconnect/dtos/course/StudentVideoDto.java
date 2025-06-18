package com.nassau.reconnect.dtos.course;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentVideoDto {
    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private String url;
    private String thumbnail;
    private boolean isWatched;
    private Integer watchedDuration;
    private LocalDateTime lastWatchedAt;
}