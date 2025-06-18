package com.nassau.reconnect.dtos.coupon;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponDto {
    private Long id;
    private String title;
    private String image;
    private String description;
    private Integer scoreRequired;
    private LocalDateTime validUntil;
    private List<Long> redeemedByIds;
}