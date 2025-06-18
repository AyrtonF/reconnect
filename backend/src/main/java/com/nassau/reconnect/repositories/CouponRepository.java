package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    List<Coupon> findByValidUntilAfter(LocalDateTime date);

    List<Coupon> findByScoreRequiredLessThanEqual(Integer score);

    @Query("SELECT c FROM Coupon c WHERE c.validUntil > :currentDate AND c.scoreRequired <= :score")
    List<Coupon> findAvailableCoupons(@Param("currentDate") LocalDateTime currentDate, @Param("score") Integer score);

    @Query("SELECT c FROM Coupon c WHERE c.validUntil BETWEEN :fromDate AND :toDate")
    List<Coupon> findExpiringCoupons(@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
}