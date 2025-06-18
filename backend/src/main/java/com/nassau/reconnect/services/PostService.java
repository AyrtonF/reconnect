package com.nassau.reconnect.services;


import com.nassau.reconnect.dtos.PaginatedResponse;
import com.nassau.reconnect.dtos.post.PostCreateDto;
import com.nassau.reconnect.dtos.post.PostDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.PostMapper;
import com.nassau.reconnect.models.Family;
import com.nassau.reconnect.models.Post;
import com.nassau.reconnect.models.User;
import com.nassau.reconnect.repositories.FamilyRepository;
import com.nassau.reconnect.repositories.PostRepository;
import com.nassau.reconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;

    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream()
                .map(postMapper::toDto)
                .collect(Collectors.toList());
    }

    public PostDto getPostById(Long id) {
        return postRepository.findById(id)
                .map(postMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    public List<PostDto> getPostsByFamily(Long familyId) {
        return postRepository.findByFamilyId(familyId).stream()
                .map(postMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<PostDto> getPostsByUser(Long userId) {
        return postRepository.findByUserId(userId).stream()
                .map(postMapper::toDto)
                .collect(Collectors.toList());
    }

    public PaginatedResponse<PostDto> getPaginatedPostsByFamily(Long familyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<Post> postPage = postRepository.findByFamilyId(familyId, pageable);

        List<PostDto> posts = postPage.getContent().stream()
                .map(postMapper::toDto)
                .collect(Collectors.toList());

        return PaginatedResponse.<PostDto>builder()
                .items(posts)
                .page(page)
                .pageSize(size)
                .total(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .build();
    }

    @Transactional
    public PostDto createPost(PostCreateDto postCreateDto) {
        Post post = postMapper.toEntity(postCreateDto);

        // Set user
        User user = userRepository.findById(postCreateDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + postCreateDto.getUserId()));
        post.setUser(user);

        // Set family if provided
        if (postCreateDto.getFamilyId() != null) {
            Family family = familyRepository.findById(postCreateDto.getFamilyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Family not found with id: " + postCreateDto.getFamilyId()));
            post.setFamily(family);
        }

        Post savedPost = postRepository.save(post);
        return postMapper.toDto(savedPost);
    }

    @Transactional
    public PostDto updatePost(Long id, PostDto postUpdateDto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        // Only update content and image
        post.setCaption(postUpdateDto.getCaption());
        post.setImage(postUpdateDto.getImage());

        Post updatedPost = postRepository.save(post);
        return postMapper.toDto(updatedPost);
    }

    @Transactional
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("Post not found with id: " + id);
        }

        postRepository.deleteById(id);
    }

    @Transactional
    public Integer likePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        Integer currentLikes = post.getLikes();
        if (currentLikes == null) {
            post.setLikes(1);
        } else {
            post.setLikes(currentLikes + 1);
        }

        Post updatedPost = postRepository.save(post);
        return updatedPost.getLikes();
    }

    @Transactional
    public Integer unlikePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        Integer currentLikes = post.getLikes();
        if (currentLikes != null && currentLikes > 0) {
            post.setLikes(currentLikes - 1);
        }

        Post updatedPost = postRepository.save(post);
        return updatedPost.getLikes();
    }
}