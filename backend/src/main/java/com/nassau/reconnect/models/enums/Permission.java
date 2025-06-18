package com.nassau.reconnect.models.enums;

public enum Permission {
    // General user permissions
    READ_OWN_PROFILE,
    UPDATE_OWN_PROFILE,

    // Course related permissions
    ENROLL_COURSE,
    VIEW_COURSE,
    CREATE_COURSE_CONTENT,
    EDIT_OWN_COURSE_CONTENT,
    VIEW_STUDENT_PROGRESS,

    // Family related permissions
    JOIN_FAMILY,
    CREATE_POST,

    // Challenge related permissions
    PARTICIPATE_CHALLENGE,

    // Coupon related permissions
    REDEEM_COUPON,

    // Admin permissions
    ADMIN_ACCESS,
    MANAGE_USERS,
    MANAGE_COURSES,
    MANAGE_FAMILIES,
    MANAGE_CHALLENGES,
    MANAGE_COUPONS,
    VIEW_REPORTS,

    // Institution permissions
    MANAGE_INSTITUTION,
    MANAGE_INSTITUTION_COURSES,
    MANAGE_INSTITUTION_USERS,
    VIEW_INSTITUTION_REPORTS,
    CREATE_INSTITUTION_COUPONS,
    VIEW_INSTITUTION_COURSES,
    BASIC_INSTITUTION_ACCESS
}