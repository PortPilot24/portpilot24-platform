package com.example.user.service;

import com.example.user.domain.User;
import com.example.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.example.user.domain.User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));

        boolean accountNonLocked = !u.isLockedNow();

        // 권한
        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()));

    return org.springframework.security.core.userdetails.User
        .withUsername(u.getEmail())
        .password(u.getPasswordHash())     // ← 해시 컬럼!
        .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name())))
        .accountExpired(false)
        .credentialsExpired(false)
        .disabled(false)
        .accountLocked(!accountNonLocked)  // ← 중요: 잠김이면 true
        .build();
    }
}

