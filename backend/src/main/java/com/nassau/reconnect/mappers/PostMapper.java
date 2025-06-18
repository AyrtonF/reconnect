package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.post.PostCreateDto;
import com.nassau.reconnect.dtos.post.PostDto;
import com.nassau.reconnect.models.Post;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface PostMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "userAvatar", source = "user.avatar")
    @Mapping(target = "familyId", source = "family.id")
    PostDto toDto(Post post);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "family", ignore = true)
    @Mapping(target = "likes", constant = "0")
    @Mapping(target = "timestamp", expression = "java(java.time.LocalDateTime.now())")
    Post toEntity(PostCreateDto postCreateDto);
}