package com.nassau.reconnect.controllers;

import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.PaginatedResponse;
import com.nassau.reconnect.dtos.post.PostCreateDto;
import com.nassau.reconnect.dtos.post.PostDto;
import com.nassau.reconnect.services.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@CrossOrigin
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PostDto>>> getAllPosts() {
        List<PostDto> posts = postService.getAllPosts();
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDto>> getPostById(@PathVariable Long id) {
        PostDto post = postService.getPostById(id);
        return ResponseEntity.ok(ApiResponse.success(post));
    }

    @GetMapping("/family/{familyId}")
    public ResponseEntity<ApiResponse<List<PostDto>>> getPostsByFamily(
            @PathVariable Long familyId) {
        List<PostDto> posts = postService.getPostsByFamily(familyId);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PostDto>>> getPostsByUser(
            @PathVariable Long userId) {
        List<PostDto> posts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @GetMapping("/family/{familyId}/paginated")
    public ResponseEntity<ApiResponse<PaginatedResponse<PostDto>>> getPaginatedPostsByFamily(
            @PathVariable Long familyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<PostDto> paginatedResponse = postService.getPaginatedPostsByFamily(familyId, page, size);
        return ResponseEntity.ok(ApiResponse.success(paginatedResponse));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PostDto>> createPost(@Valid @RequestBody PostCreateDto postCreateDto) {
        PostDto createdPost = postService.createPost(postCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdPost, "Post created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @postSecurity.isPostOwner(#id)")
    public ResponseEntity<ApiResponse<PostDto>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostDto postUpdateDto) {
        PostDto updatedPost = postService.updatePost(id, postUpdateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedPost, "Post updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @postSecurity.isPostOwner(#id)")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Post deleted successfully"));
    }

    @PostMapping("/{id}/like/{userId}")
    @PreAuthorize("isAuthenticated() and @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Integer>> likePost(
            @PathVariable Long id,
            @PathVariable Long userId) {
        Integer likes = postService.likePost(id);
        return ResponseEntity.ok(ApiResponse.success(likes, "Post liked successfully"));
    }

    @PostMapping("/{id}/unlike/{userId}")
    @PreAuthorize("isAuthenticated() and @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Integer>> unlikePost(
            @PathVariable Long id,
            @PathVariable Long userId) {
        Integer likes = postService.unlikePost(id);
        return ResponseEntity.ok(ApiResponse.success(likes, "Post unliked successfully"));
    }
}