package com.security.authX_backend.security;

import com.security.authX_backend.repository.UserRepository;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final  JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if(header!=null && header.startsWith("Bearer"))
        {
            // Extract token and validate the authentication and then set inside security context


            try{

                String  token = header.substring(7);
                if(!jwtService.isAccessToken(token))
                {
                    filterChain.doFilter(request,response);
                    return;
                }

                Jws<Claims> parse = jwtService.parse(token);
                Claims payload = parse.getPayload();
                UUID userId = UUID.fromString(payload.getSubject());
                userRepository.findById(userId)
                        .ifPresent(user -> {
                            if(!user.isEnable())
                            {
                                try {
                                    filterChain.doFilter(request,response);
                                } catch (IOException | ServletException e) {
                                    throw new RuntimeException(e);
                                }
                            }
                            if(user.isEnabled())
                            {
                                List<GrantedAuthority> authorities = user.getRoles() == null ? List.of() : user.getRoles().stream()
                                        .map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());

                                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                        user.getEmail(),
                                        null,
                                        authorities
                                );
                                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                if(SecurityContextHolder.getContext().getAuthentication() == null)
                                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                            }

                        });



            }
            catch (ExpiredJwtException e)
            {
                e.printStackTrace();
            }
            catch (MalformedJwtException e)
            {
                e.printStackTrace();

            }
            catch (JwtException e)
            {
                e.printStackTrace();

            }
            catch (Exception e) {
                e.printStackTrace();

            }
        }

        filterChain.doFilter(request,response);

    }
}
