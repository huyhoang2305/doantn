package vn.student.webbangiay.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.student.webbangiay.dto.AdminUserDto;
import vn.student.webbangiay.dto.ChangePasswordDto;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.response.AdminUserResponse;
import vn.student.webbangiay.model.AdminUser;
import vn.student.webbangiay.repository.AdminUserRepository;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {
    private final AdminUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(AdminUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AdminUserResponse createUser(AdminUserDto userDto) {
        AdminUser newUser = new AdminUser();
        mapDtoToEntity(userDto, newUser);
        newUser.setHashPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setCreatedAt(new Date());
        newUser.setUpdatedAt(new Date());
        userRepository.save(newUser);
        return mapToResponse(newUser);
    }

    public AdminUserResponse updateUser(String userId, AdminUserDto userDto) {
        AdminUser existingUser = findUserById(userId);
        mapDtoToEntity(userDto, existingUser);
        existingUser.setUpdatedAt(new Date());
        userRepository.save(existingUser);
        return mapToResponse(existingUser);
    }

    public AdminUserResponse updateUserProfile(String userId, AdminUserDto userDto) {
        AdminUser existingUser = findUserById(userId);
        // Only update profile fields, not password
        existingUser.setEmail(userDto.getEmail());
        existingUser.setFullName(userDto.getFullName());
        existingUser.setRole(userDto.getRole());
        existingUser.setIsActive(userDto.getIsActive());
        existingUser.setUpdatedAt(new Date());
        userRepository.save(existingUser);
        return mapToResponse(existingUser);
    }

    public boolean changePassword(String userId, ChangePasswordDto changePasswordDto) {
        AdminUser user = findUserById(userId);
        
        // Validate old password
        if (!passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getHashPassword())) {
            return false; // Old password is incorrect
        }
        
        // Update to new password
        user.setHashPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        return true; // Password changed successfully
    }

    public String uploadAvatar(String userId, MultipartFile file) {
        // Implementation for avatar upload
        // This would typically involve saving the file to a storage service
        // and updating the user's avatar URL in the database
        // For now, returning a placeholder
        AdminUser user = findUserById(userId);
        String avatarUrl = "/uploads/avatars/" + userId + "_" + file.getOriginalFilename();
        // user.setAvatarUrl(avatarUrl); // Assuming you have this field
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        return avatarUrl;
    }
    

    public void deleteUser(String userId) {
        AdminUser user = findUserById(userId);
        userRepository.delete(user);
    }

    public AdminUserResponse getUserById(String userId) {
        return mapToResponse(findUserById(userId));
    }

    public AdminUserResponse findByEmail(String email) {
        AdminUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToResponse(user);
    }

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AdminUser findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    private void mapDtoToEntity(AdminUserDto userDto, AdminUser user) {
        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        user.setRole(userDto.getRole());
        user.setIsActive(userDto.getIsActive());
    }

    private AdminUserResponse mapToResponse(AdminUser user) {
        return new AdminUserResponse(
            user.getAdminUserId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole(),
            user.getIsActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
