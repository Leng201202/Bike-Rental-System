package com.bikerental.backend.config;

import com.bikerental.backend.modules.auth.AuthSession;
import com.bikerental.backend.modules.auth.AuthTokenStore;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final AuthTokenStore authTokenStore;

    public TokenAuthenticationFilter(AuthTokenStore authTokenStore) {
        this.authTokenStore = authTokenStore;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7).trim();
            Optional<AuthSession> session = authTokenStore.resolve(token);
            if (session.isPresent() && SecurityContextHolder.getContext().getAuthentication() == null) {
                AuthSession value = session.get();
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    value.username(),
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + value.role().name()))
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
