package vn.student.webbangiay.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import vn.student.webbangiay.dto.LoginUserDto;
import vn.student.webbangiay.model.AdminUser;
import vn.student.webbangiay.repository.AdminUserRepository;

@Service
public class AuthenticationService {
    private final AdminUserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
        AdminUserRepository userRepository,
        AuthenticationManager authenticationManager
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

   public AdminUser authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                input.getEmail(),
                input.getPassword()
            )
        );

        AdminUser user = userRepository.findByEmail(input.getEmail()).get();
        return user;
    }
}
