package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.student.webbangiay.dto.BannerDto;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.model.Banner;
import vn.student.webbangiay.service.BannerService;
import vn.student.webbangiay.util.ValidationUtils;

import java.util.List;

@RestController
@RequestMapping("/banners")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    @GetMapping
    public ResponseEntity<List<Banner>> getAllBanners() {
        List<Banner> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(banners);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Banner> getBannerById(@PathVariable Integer id) {
        Banner banner = bannerService.getBannerById(id);
        if (banner == null) {
            throw new ResourceNotFoundException("Banner with ID " + id + " not found");
        }
        return ResponseEntity.ok(banner);
    }

    @PostMapping
    public ResponseEntity<?> createBanner(@ModelAttribute @Valid BannerDto bannerDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        
        Banner banner = bannerService.createBanner(bannerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(banner);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBanner(@PathVariable Integer id, @ModelAttribute @Valid BannerDto bannerDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }

        Banner banner = bannerService.updateBanner(id, bannerDto);
        if (banner == null) {
            throw new ResourceNotFoundException("Banner with ID " + id + " not found");
        }
        return ResponseEntity.ok(banner);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Integer id) {
        Banner banner = bannerService.getBannerById(id);
        if (banner == null) {
            throw new ResourceNotFoundException("Banner with ID " + id + " not found");
        }
        
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleBannerStatus(@PathVariable Integer id) {
        try {
            Banner banner = bannerService.toggleBannerStatus(id);
            vn.student.webbangiay.response.ToggleStatusResponse response = 
                new vn.student.webbangiay.response.ToggleStatusResponse(banner.getBannerId(), banner.getIsActive());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
