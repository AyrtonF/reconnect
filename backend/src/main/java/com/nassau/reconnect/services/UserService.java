package com.nassau.reconnect.services;


import com.nassau.reconnect.dtos.user.UserCreateDto;
import com.nassau.reconnect.dtos.user.UserDto;
import com.nassau.reconnect.dtos.user.UserUpdateDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.UserMapper;
import com.nassau.reconnect.models.User;
import com.nassau.reconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public List<UserDto> getUsersByInstitution(Long institutionId) {
        return userRepository.findByInstitutionId(institutionId).stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto createUser(UserCreateDto userCreateDto) {
        if (userRepository.existsByEmail(userCreateDto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = userMapper.toEntity(userCreateDto);
        user.setPassword(passwordEncoder.encode(userCreateDto.getPassword()));
        User savedUser = userRepository.save(user);

        return userMapper.toDto(savedUser);
    }

    @Transactional
    public UserDto updateUser(Long id, UserUpdateDto userUpdateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userMapper.updateEntityFromDto(userUpdateDto, user);

        if (userUpdateDto.getPassword() != null && !userUpdateDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userUpdateDto.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}