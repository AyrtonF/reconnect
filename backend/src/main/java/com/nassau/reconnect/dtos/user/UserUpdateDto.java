package com.nassau.reconnect.dtos.user;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    private String name;
    private String phone;
    private String avatar;
    private String password;
}