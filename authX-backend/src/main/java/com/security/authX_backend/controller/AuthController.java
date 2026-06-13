package com.security.authX_backend.controller;

import com.security.authX_backend.dto.LoginRequest;
import com.security.authX_backend.dto.TokenResponse;
import com.security.authX_backend.dto.UserDto;
import com.security.authX_backend.entity.RefreshToken;
import com.security.authX_backend.entity.User;
import com.security.authX_backend.repository.RefreshTokenRepository;
import com.security.authX_backend.repository.UserRepository;
import com.security.authX_backend.security.CookieService;
import com.security.authX_backend.security.JwtService;
import com.security.authX_backend.service.ServiceImpl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthServiceImpl authService;
    private final AuthenticationManager authenticationManager;
    private  final UserRepository userRepository;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;
    private  final RefreshTokenRepository refreshTokenRepository;
    private final CookieService cookieService;

    public AuthController(AuthServiceImpl authService, AuthenticationManager authenticationManager, UserRepository userRepository, JwtService jwtService, ModelMapper modelMapper, RefreshTokenRepository refreshTokenRepository, CookieService cookieService) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.modelMapper = modelMapper;
        this.refreshTokenRepository = refreshTokenRepository;
        this.cookieService = cookieService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest , HttpServletResponse response)
    {
        Authentication authentication =  authenticate(loginRequest);
        User user = userRepository.findByEmail(loginRequest.email()).orElseThrow(()-> new BadCredentialsException("Invalid Username or Password"));
        if(!user.isEnable())
        {
            throw  new DisabledException("User is Disabled");
        }
        String jwtId = UUID.randomUUID().toString();
        var refreshTokenObj = RefreshToken.builder()
                .jwtId(jwtId)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenObj);
        String refreshToken = jwtService.generateRefreshToken(user,refreshTokenObj.getJwtId());

        String accessToken = jwtService.generateToken(user);
        cookieService.attachRefreshCookie(response,refreshToken,(int)jwtService.getRefreshTtlSeconds());
        TokenResponse tokenResponse = TokenResponse.of(accessToken,refreshToken,jwtService.getAccessTtlSeconds(),"Bearer",modelMapper.map(user,UserDto.class));
        return ResponseEntity.ok(tokenResponse);
    }

    public Authentication authenticate(LoginRequest loginRequest)
    {
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(userDto));
    }
}
