package com.nassau.reconnect.dtos.family;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyDto {
    private Long id;
    private String name;
    private List<Long> membersIds;
    private List<Long> postsIds;
    private List<Long> challengesIds;
}