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
import vn.student.webbangiay.dto.BrandDto;
import vn.student.webbangiay.model.Brand;
import vn.student.webbangiay.service.BrandService;
import vn.student.webbangiay.util.ValidationUtils;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public ResponseEntity<List<Brand>> getAllBrands() {
        List<Brand> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Integer id) {
        Brand brand = brandService.getBrandById(id);
        return ResponseEntity.ok(brand);
    }

    @PostMapping
    public ResponseEntity<?> createBrand(@ModelAttribute @Valid BrandDto brandDto, BindingResult result) throws IOException {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        Brand brand = brandService.createBrand(brandDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(brand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable Integer id, @ModelAttribute @Valid BrandDto brandDto, BindingResult result) throws IOException {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        Brand brand = brandService.updateBrand(id, brandDto);
        return ResponseEntity.ok(brand);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleBrandStatus(@PathVariable Integer id) {
        try {
            Brand brand = brandService.toggleBrandStatus(id);
            vn.student.webbangiay.response.ToggleStatusResponse response = 
                new vn.student.webbangiay.response.ToggleStatusResponse(brand.getBrandId(), brand.getIsActive());
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
