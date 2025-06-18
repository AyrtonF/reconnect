package com.nassau.reconnect.controllers;

import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.coupon.CouponCreateDto;
import com.nassau.reconnect.dtos.coupon.CouponDto;
import com.nassau.reconnect.services.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
@CrossOrigin
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CouponDto>>> getAllCoupons() {
        List<CouponDto> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponDto>> getCouponById(@PathVariable Long id) {
        CouponDto coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(ApiResponse.success(coupon));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<CouponDto>>> getAvailableCoupons(
            @RequestParam(defaultValue = "0") Integer userScore) {
        List<CouponDto> coupons = couponService.getAvailableCoupons(userScore);
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<CouponDto>>> getExpiringCoupons(
            @RequestParam(defaultValue = "7") Integer daysThreshold) {
        List<CouponDto> coupons = couponService.getExpiringCoupons(daysThreshold);
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @GetMapping("/{id}/available")
    public ResponseEntity<ApiResponse<Boolean>> isCouponAvailable(
            @PathVariable Long id,
            @RequestParam Integer userScore) {
        boolean isAvailable = couponService.isCouponAvailable(id, userScore);
        return ResponseEntity.ok(ApiResponse.success(isAvailable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasPermission(null, 'Coupon', 'CREATE')")
    public ResponseEntity<ApiResponse<CouponDto>> createCoupon(@Valid @RequestBody CouponCreateDto couponCreateDto) {
        CouponDto createdCoupon = couponService.createCoupon(couponCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdCoupon, "Coupon created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasPermission(null, 'Coupon', 'UPDATE')")
    public ResponseEntity<ApiResponse<CouponDto>> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponCreateDto couponUpdateDto) {
        CouponDto updatedCoupon = couponService.updateCoupon(id, couponUpdateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCoupon, "Coupon updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasPermission(null, 'Coupon', 'DELETE')")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Coupon deleted successfully"));
    }

    @PostMapping("/{couponId}/redeem/{userId}")
    @PreAuthorize("hasPermission(#userId, 'User', 'UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Boolean>> redeemCoupon(
            @PathVariable Long couponId,
            @PathVariable Long userId) {
        boolean redeemed = couponService.redeemCoupon(couponId, userId);

        if (redeemed) {
            return ResponseEntity.ok(ApiResponse.success(true, "Coupon redeemed successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to redeem coupon", "User may not have enough points or coupon already redeemed"));
        }
    }
}
