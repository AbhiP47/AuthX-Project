package com.security.authX_backend.service.ServiceImpl;

import com.security.authX_backend.dto.UserDto;
import com.security.authX_backend.entity.User;
import com.security.authX_backend.enums.Provider;
import com.security.authX_backend.repository.UserRepository;
import com.security.authX_backend.service.AuthService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private  final ModelMapper modelMapper;

    public AuthServiceImpl(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
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
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser,UserDto.class);
    }
}
