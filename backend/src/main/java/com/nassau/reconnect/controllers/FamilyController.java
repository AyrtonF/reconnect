package com.nassau.reconnect.controllers;

import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.family.FamilyCreateDto;
import com.nassau.reconnect.dtos.family.FamilyDto;
import com.nassau.reconnect.services.FamilyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/families")
@RequiredArgsConstructor
@CrossOrigin
public class FamilyController {

    private final FamilyService familyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FamilyDto>>> getAllFamilies() {
        List<FamilyDto> families = familyService.getAllFamilies();
        return ResponseEntity.ok(ApiResponse.success(families));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FamilyDto>> getFamilyById(@PathVariable Long id) {
        FamilyDto family = familyService.getFamilyById(id);
        return ResponseEntity.ok(ApiResponse.success(family));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FamilyDto>>> searchFamilies(@RequestParam String name) {
        List<FamilyDto> families = familyService.searchFamiliesByName(name);
        return ResponseEntity.ok(ApiResponse.success(families));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<FamilyDto>>> getUserFamilies(@PathVariable Long userId) {
        List<FamilyDto> families = familyService.getUserFamilies(userId);
        return ResponseEntity.ok(ApiResponse.success(families));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FamilyDto>> createFamily(@Valid @RequestBody FamilyCreateDto familyCreateDto) {
        FamilyDto createdFamily = familyService.createFamily(familyCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdFamily, "Family created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @familySecurity.canManageFamily(#id)")
    public ResponseEntity<ApiResponse<FamilyDto>> updateFamily(
            @PathVariable Long id,
            @Valid @RequestBody FamilyDto familyUpdateDto) {
        FamilyDto updatedFamily = familyService.updateFamily(id, familyUpdateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedFamily, "Family updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @familySecurity.canManageFamily(#id)")
    public ResponseEntity<ApiResponse<Void>> deleteFamily(@PathVariable Long id) {
        familyService.deleteFamily(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Family deleted successfully"));
    }

    @PostMapping("/{familyId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @familySecurity.canManageFamily(#familyId) or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Boolean>> addMemberToFamily(
            @PathVariable Long familyId,
            @PathVariable Long userId) {
        boolean added = familyService.addMemberToFamily(familyId, userId);
        if (added) {
            return ResponseEntity.ok(ApiResponse.success(true, "User added to family successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to add user to family", "User may already be a member"));
        }
    }

    @DeleteMapping("/{familyId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @familySecurity.canManageFamily(#familyId) or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Boolean>> removeMemberFromFamily(
            @PathVariable Long familyId,
            @PathVariable Long userId) {
        boolean removed = familyService.removeMemberFromFamily(familyId, userId);
        if (removed) {
            return ResponseEntity.ok(ApiResponse.success(true, "User removed from family successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to remove user from family", "User may not be a member"));
        }
    }
}