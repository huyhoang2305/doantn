package vn.student.webbangiay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.student.webbangiay.dto.ChangePasswordDto;
import vn.student.webbangiay.dto.LoginUserDto;
import vn.student.webbangiay.model.AdminUser;
import vn.student.webbangiay.model.Role;
import vn.student.webbangiay.response.AdminUserResponse;
import vn.student.webbangiay.response.LoginResponse;
import vn.student.webbangiay.service.AdminUserService;
import vn.student.webbangiay.service.AuthenticationService;
import vn.student.webbangiay.service.JwtService;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final AdminUserService adminUserService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, AdminUserService adminUserService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.adminUserService = adminUserService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        // Authenticate the user
        AdminUser authenticatedUser = authenticationService.authenticate(loginUserDto);
    
        // Get role
        Role role = authenticatedUser.getRole();

        // Generate JWT token with roles
        String jwtToken = jwtService.generateToken(authenticatedUser, role);
    
        // Create response with token and expiration time
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
    
        return ResponseEntity.ok(loginResponse);
    }
    
    @GetMapping("/me")
    public ResponseEntity<AdminUserResponse> getAuthenticatedUser() {
        AdminUser currentUser = getCurrentUser();
        return ResponseEntity.ok(adminUserService.getUserById(currentUser.getAdminUserId()));
    }
    
    @PostMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordDto changePasswordDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(null);
        }

        AdminUser currentUser = getCurrentUser();
        adminUserService.changePassword(currentUser.getAdminUserId(), changePasswordDto);
        return ResponseEntity.noContent().build();
    }

    private AdminUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (AdminUser) authentication.getPrincipal();
    }
}