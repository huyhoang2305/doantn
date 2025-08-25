package vn.student.webbangiay.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid; 
import vn.student.webbangiay.dto.AdminUserDto;
import vn.student.webbangiay.dto.ChangePasswordDto;
import vn.student.webbangiay.dto.UpdateProfileDto;
import vn.student.webbangiay.response.AdminUserResponse;
import vn.student.webbangiay.service.AdminUserService;

import java.util.List;

@RestController
@RequestMapping("/users")
public class AdminUserController {
    private final AdminUserService userService;

    public AdminUserController(AdminUserService userService) {
        this.userService = userService;
    }



    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUserDto userDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Error: " + result.getAllErrors());
        }

        if (userService.findByEmail(userDto.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Error: Email already exists");
        }

        AdminUserResponse createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @Valid @RequestBody AdminUserDto userDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Error: " + result.getAllErrors());
        }

        AdminUserResponse updatedUser = userService.updateUser(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // Lấy thông tin admin user theo ID
    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable String userId) {
        AdminUserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    // Lấy profile admin hiện tại
    @GetMapping("/profile")
    public ResponseEntity<AdminUserResponse> getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        AdminUserResponse profile = userService.findByEmail(currentUserEmail);
        return ResponseEntity.ok(profile);
    }

    // Cập nhật profile admin hiện tại
    @PutMapping("/profile")
    public ResponseEntity<AdminUserResponse> updateCurrentProfile(@Valid @RequestBody UpdateProfileDto updateProfileDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        AdminUserResponse currentUser = userService.findByEmail(currentUserEmail);
        
        // Create AdminUserDto with existing data and updated fullName
        AdminUserDto userDto = new AdminUserDto();
        userDto.setFullName(updateProfileDto.getFullName());
        userDto.setEmail(currentUser.getEmail());
        userDto.setPassword("unchanged"); // This will be handled by the service
        userDto.setRole(currentUser.getRole());
        userDto.setIsActive(currentUser.getIsActive());
        
        AdminUserResponse updatedUser = userService.updateUserProfile(currentUser.getAdminUserId(), userDto);
        return ResponseEntity.ok(updatedUser);
    }

    // Thay đổi mật khẩu admin hiện tại
    @PutMapping("/change-password")
    public ResponseEntity<?> changeCurrentPassword(@Valid @RequestBody ChangePasswordDto changePasswordDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Error: " + result.getAllErrors());
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        AdminUserResponse currentUser = userService.findByEmail(currentUserEmail);
        
        boolean success = userService.changePassword(currentUser.getAdminUserId(), changePasswordDto);
        if (success) {
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } else {
            return ResponseEntity.badRequest().body("Mật khẩu cũ không đúng");
        }
    }

    // Thay đổi mật khẩu admin theo ID
    @PutMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable String userId, @Valid @RequestBody ChangePasswordDto changePasswordDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Error: " + result.getAllErrors());
        }

        boolean success = userService.changePassword(userId, changePasswordDto);
        if (success) {
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } else {
            return ResponseEntity.badRequest().body("Mật khẩu cũ không đúng");
        }
    }

    // Upload avatar admin
    @PostMapping("/{userId}/avatar")
    public ResponseEntity<?> uploadAvatar(@PathVariable String userId, @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = userService.uploadAvatar(userId, file);
            return ResponseEntity.ok(avatarUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading avatar: " + e.getMessage());
        }
    }


}
