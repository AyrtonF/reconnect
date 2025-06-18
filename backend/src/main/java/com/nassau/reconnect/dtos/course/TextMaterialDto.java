package com.nassau.reconnect.dtos.course;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextMaterialDto {
    private Long id;
    private String title;
    private String content;
    private Integer estimatedReadTime;
    private boolean isRead;
    private List<Attachment> attachments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Attachment {
        private String name;
        private String url;
        private String type;
    }
}