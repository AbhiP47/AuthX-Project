package com.security.authX_backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@Getter
public class CookieService {

    private  final String refreshTokienCookieName;
    private final boolean cookieHttpOnly;
    private  final boolean cookieSecure;
    private  final String cookieDomain;
    private  final String cookieSameSite;

    public CookieService(@Value("${security.jwt.refresh-token-cookie-name}") String refreshTokienCookieName,
                         @Value("${security.jwt.cookie-http-only}") boolean cookieHttpOnly,
                         @Value("${security.jwt.cookie-secure}") boolean cookieSecure,
                         @Value("${security.jwt.cookie-domain}") String cookieDomain,
                         @Value("${security.jwt.cookie-same-site}") String cookieSameSite) {
        this.refreshTokienCookieName = refreshTokienCookieName;
        this.cookieHttpOnly = cookieHttpOnly;
        this.cookieSecure = cookieSecure;
        this.cookieDomain = cookieDomain;
        this.cookieSameSite = cookieSameSite;
    }

    // Crete method to attach cookie to response
    public void attachRefreshCookie(HttpServletResponse response , String value , int maxAge)
    {
        var responseCookieBuilder = ResponseCookie.from(refreshTokienCookieName,value)
                .httpOnly(cookieHttpOnly)
                .secure(cookieSecure)
                .path("/")
                .maxAge(maxAge)
                .sameSite(cookieSameSite);

        if(cookieDomain != null || !cookieDomain.isBlank())
            responseCookieBuilder.domain(cookieDomain);

        ResponseCookie responseCookie = responseCookieBuilder.build();
        response.addHeader(HttpHeaders.SET_COOKIE,responseCookie.toString());

    }

    // Clear Refresh Cookie
    public void clearRefreshCookie(HttpServletResponse response)
    {
        var builder = ResponseCookie.from(refreshTokienCookieName,"")
                .maxAge(0)
                .httpOnly(cookieHttpOnly)
                .path("/")
                .sameSite(cookieSameSite)
                .secure(cookieSecure);

        if(cookieDomain != null || !cookieDomain.isBlank())
            builder.domain(cookieDomain);

        ResponseCookie responseCookie = builder.build();
        response.addHeader(HttpHeaders.SET_COOKIE,responseCookie.toString());
    }


}
