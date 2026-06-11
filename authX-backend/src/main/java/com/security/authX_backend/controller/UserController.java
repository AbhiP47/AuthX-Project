package com.security.authX_backend.controller;


import com.security.authX_backend.dto.UserDto;
import com.security.authX_backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
public class UserController {

    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/createUser")
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto)
    {
        return  ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userDto));
    }

    @GetMapping("/getUsers")
    public ResponseEntity<Iterable<UserDto>> getAllUsers()
    {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable("email") String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    //delete user
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUser(userId);
    }

    //update user
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto, @PathVariable("userId") String userId) {
        return ResponseEntity.ok(userService.updateUser(userDto, userId));
    }


}
