package com.security.authX_backend.service.ServiceImpl;

import com.security.authX_backend.dto.UserDto;
import com.security.authX_backend.entity.User;
import com.security.authX_backend.enums.Provider;
import com.security.authX_backend.exceptions.ResourceNotFoundException;
import com.security.authX_backend.helpers.UserIdHelper;
import com.security.authX_backend.repository.UserRepository;
import com.security.authX_backend.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public UserServiceImpl(ModelMapper modelMapper, UserRepository userRepository) {
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {

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

    @Override
    public UserDto getUserByEmail(String email) {
       User user =  userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found with given email id"));
        return modelMapper.map(user , UserDto.class);
    }

    @Override
    public UserDto updateUser(UserDto userDto, String userId) {
        UUID id = UserIdHelper.parseUUID(userId);
        User existingUser = userRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with given id"));
        //we are not going to change email id for this project.
        if (userDto.getName() != null) existingUser.setName(userDto.getName());
        if (userDto.getImage() != null) existingUser.setImage(userDto.getImage());
        if (userDto.getProvider() != null) existingUser.setProvider(userDto.getProvider());
        //TODO: change password updation logic...
        if (userDto.getPassword() != null) existingUser.setPassword(userDto.getPassword());
        existingUser.setEnable(userDto.isEnable());
        existingUser.setUpdatedAt(Instant.now());
        User updatedUser = userRepository.save(existingUser);
        return modelMapper.map(updatedUser, UserDto.class);
    }

    @Override
    public void deleteUser(String id) {
        UUID userId = UserIdHelper.parseUUID(id);
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User not found with the given id : "+id));
        userRepository.delete(user);
    }

    @Override
    public UserDto getUserById(String userId) {
        UUID id = UserIdHelper.parseUUID(userId);
        User user = userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("User not found with the given id : "+id));
        return modelMapper.map(user,UserDto.class);
    }

    @Override
    @Transactional(readOnly = true)
    public Iterable<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user,UserDto.class))
                .toList();
    }
}
