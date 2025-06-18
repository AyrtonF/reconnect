package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.course.TextMaterialDto;
import com.nassau.reconnect.models.TextMaterial;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface TextMaterialMapper {

    @Mapping(target = "attachments", source = "attachments")
    TextMaterialDto toDto(TextMaterial textMaterial);

    TextMaterialDto.Attachment toAttachmentDto(TextMaterial.Attachment attachment);
}