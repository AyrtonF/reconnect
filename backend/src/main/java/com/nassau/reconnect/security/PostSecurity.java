package com.nassau.reconnect.security;

import com.nassau.reconnect.models.Post;
import com.nassau.reconnect.repositories.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PostSecurity {

    private final PostRepository postRepository;

    public boolean isPostOwner(Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            Optional<Post> postOpt = postRepository.findById(postId);
            if (postOpt.isPresent()) {
                Post post = postOpt.get();

                // Check if authenticated user is the owner of the post
                return post.getUser().getId().equals(userPrincipal.getId());
            }
        }

        return false;
    }
}