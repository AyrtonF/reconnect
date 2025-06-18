package com.nassau.reconnect.services;


import com.nassau.reconnect.dtos.coupon.CouponCreateDto;
import com.nassau.reconnect.dtos.coupon.CouponDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.CouponMapper;
import com.nassau.reconnect.models.Coupon;
import com.nassau.reconnect.models.User;
import com.nassau.reconnect.repositories.CouponRepository;
import com.nassau.reconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final CouponMapper couponMapper;

    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(couponMapper::toDto)
                .collect(Collectors.toList());
    }

    public CouponDto getCouponById(Long id) {
        return couponRepository.findById(id)
                .map(couponMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
    }

    public List<CouponDto> getAvailableCoupons(Integer userScore) {
        LocalDateTime currentDate = LocalDateTime.now();
        return couponRepository.findAvailableCoupons(currentDate, userScore).stream()
                .map(couponMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<CouponDto> getExpiringCoupons(int daysThreshold) {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime thresholdDate = currentDate.plusDays(daysThreshold);

        return couponRepository.findExpiringCoupons(currentDate, thresholdDate).stream()
                .map(couponMapper::toDto)
                .collect(Collectors.toList());
    }

    public boolean isCouponAvailable(Long couponId, Integer userScore) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + couponId));

        boolean isValid = coupon.getValidUntil() == null || coupon.getValidUntil().isAfter(LocalDateTime.now());
        boolean hasEnoughScore = coupon.getScoreRequired() == null || userScore >= coupon.getScoreRequired();

        return isValid && hasEnoughScore;
    }

    @Transactional
    public CouponDto createCoupon(CouponCreateDto couponCreateDto) {
        Coupon coupon = couponMapper.toEntity(couponCreateDto);
        Coupon savedCoupon = couponRepository.save(coupon);

        return couponMapper.toDto(savedCoupon);
    }

    @Transactional
    public CouponDto updateCoupon(Long id, CouponCreateDto couponUpdateDto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        couponMapper.updateEntityFromDto(couponUpdateDto, coupon);
        Coupon updatedCoupon = couponRepository.save(coupon);

        return couponMapper.toDto(updatedCoupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coupon not found with id: " + id);
        }

        couponRepository.deleteById(id);
    }

    @Transactional
    public boolean redeemCoupon(Long couponId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + couponId));

        // Check if already redeemed
        if (user.getCoupons().contains(coupon)) {
            return false;
        }

        // Check if user has enough score
        if (coupon.getScoreRequired() != null && (user.getScore() == null || user.getScore() < coupon.getScoreRequired())) {
            return false;
        }

        // Check if coupon is still valid
        if (coupon.getValidUntil() != null && coupon.getValidUntil().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Add coupon to user and potentially deduct score
        if (user.getScore() != null && coupon.getScoreRequired() != null) {
            user.setScore(user.getScore() - coupon.getScoreRequired());
        }

        user.getCoupons().add(coupon);
        userRepository.save(user);

        return true;
    }
}