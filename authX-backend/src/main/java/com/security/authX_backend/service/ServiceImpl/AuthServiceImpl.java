package com.security.authX_backend.service.ServiceImpl;

import com.security.authX_backend.dto.UserDto;
import com.security.authX_backend.entity.User;
import com.security.authX_backend.enums.Provider;
import com.security.authX_backend.repository.UserRepository;
import com.security.authX_backend.service.AuthService;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private  final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDto registerUser(UserDto userDto) {
        if(userDto.getEmail() == null || userDto.getEmail().isBlank())
        {
            throw new IllegalArgumentException("Email is required");
        }
        if(userRepository.existsByEmail(userDto.getEmail()))
        {
            throw new IllegalArgumentException("Email Already Exists");
        }

        User user = modelMapper.map(userDto,User.class);
        user.setProvider(userDto.getProvider() != null ? userDto.getProvider() : Provider.LOCAL);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        User savedUser = userRepository.save(user);

        return modelMapper.map(savedUser,UserDto.class);
    }
}
