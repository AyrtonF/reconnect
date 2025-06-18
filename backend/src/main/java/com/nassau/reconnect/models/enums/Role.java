package com.nassau.reconnect.models.enums;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.List;

public enum Role {
    USER(Set.of(
            Permission.READ_OWN_PROFILE,
            Permission.UPDATE_OWN_PROFILE,
            Permission.ENROLL_COURSE,
            Permission.VIEW_COURSE,
            Permission.JOIN_FAMILY,
            Permission.CREATE_POST,
            Permission.PARTICIPATE_CHALLENGE,
            Permission.REDEEM_COUPON
    )),

    ADMIN(Set.of(
            Permission.ADMIN_ACCESS,
            Permission.MANAGE_USERS,
            Permission.MANAGE_COURSES,
            Permission.MANAGE_FAMILIES,
            Permission.MANAGE_CHALLENGES,
            Permission.MANAGE_COUPONS,
            Permission.VIEW_REPORTS
    )),

    INSTITUTION_ADMIN(Set.of(
            Permission.READ_OWN_PROFILE,
            Permission.UPDATE_OWN_PROFILE,
            Permission.MANAGE_INSTITUTION,
            Permission.MANAGE_INSTITUTION_COURSES,
            Permission.MANAGE_INSTITUTION_USERS,
            Permission.VIEW_INSTITUTION_REPORTS,
            Permission.CREATE_INSTITUTION_COUPONS
    )),

    INSTITUTION_TEACHER(Set.of(
            Permission.READ_OWN_PROFILE,
            Permission.UPDATE_OWN_PROFILE,
            Permission.CREATE_COURSE_CONTENT,
            Permission.EDIT_OWN_COURSE_CONTENT,
            Permission.VIEW_STUDENT_PROGRESS
    )),

    INSTITUTION_STAFF(Set.of(
            Permission.READ_OWN_PROFILE,
            Permission.UPDATE_OWN_PROFILE,
            Permission.VIEW_INSTITUTION_COURSES,
            Permission.BASIC_INSTITUTION_ACCESS
    ));

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public List<SimpleGrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}