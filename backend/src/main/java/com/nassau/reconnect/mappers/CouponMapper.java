package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.coupon.CouponCreateDto;
import com.nassau.reconnect.dtos.coupon.CouponDto;
import com.nassau.reconnect.models.Coupon;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {})
public interface CouponMapper {

    @Mapping(target = "redeemedByIds", expression = "java(getRedeemedByIds(coupon))")
    CouponDto toDto(Coupon coupon);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "redeemedBy", ignore = true)
    Coupon toEntity(CouponCreateDto couponCreateDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "redeemedBy", ignore = true)
    void updateEntityFromDto(CouponCreateDto dto, @MappingTarget Coupon entity);

    default List<Long> getRedeemedByIds(Coupon coupon) {
        if (coupon.getRedeemedBy() == null) return null;
        return coupon.getRedeemedBy().stream()
                .map(user -> user.getId())
                .collect(Collectors.toList());
    }
}