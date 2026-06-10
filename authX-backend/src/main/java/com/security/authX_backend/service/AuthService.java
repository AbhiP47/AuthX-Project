package com.security.authX_backend.service;


import com.security.authX_backend.dto.UserDto;

public interface AuthService {
    UserDto registerUser(UserDto userDto);

}
