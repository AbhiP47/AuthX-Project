package com.security.authX_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "refresh_tokens" , indexes = {
        @Index(name = "refresh_token_jwtId_idx" , columnList = "jwtId" , unique = true),
        @Index(name = "refresh_token_user_id_idx",columnList = "user_id")
})

public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "jwtId",unique = true,nullable = false,updatable = false)
    private String jwtId;

    @ManyToOne(optional = false,fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" , nullable = false,updatable = false)
    private  User user;
    @Column(nullable = false,updatable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant expiresAt;
    @Column(nullable = false)
    private boolean revoked;
    private String replacedByToken;
}
