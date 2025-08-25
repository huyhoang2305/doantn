package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vn.student.webbangiay.dto.ProductSizeDto;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.response.ProductSizeResponse;
import vn.student.webbangiay.service.ProductSizeService;
import vn.student.webbangiay.util.ValidationUtils;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/product-sizes")
public class ProductSizeController {

    @Autowired
    private ProductSizeService productSizeService;

    @GetMapping
    public ResponseEntity<List<ProductSizeResponse>> getAllProductSizes() {
        List<ProductSizeResponse> response = productSizeService.findAll();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createProductSize(@RequestBody @Valid ProductSizeDto productSizeDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        ProductSizeResponse productSize = productSizeService.createProductSize(productSizeDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productSize);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductSize(@PathVariable Integer id, @RequestBody @Valid ProductSizeDto productSizeDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        try {
            ProductSizeResponse updatedSize = productSizeService.updateProductSize(id, productSizeDto);
            return ResponseEntity.ok(updatedSize);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Product size not found with ID: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductSize(@PathVariable Integer id) {
        try {
            productSizeService.deleteProductSize(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Product size not found with ID: " + id);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductSizeResponse> findProductSizeById(@PathVariable Integer id) {
        ProductSizeResponse response = productSizeService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product-color/{productColorId}")
    public ResponseEntity<List<ProductSizeResponse>> findByProductColorId(@PathVariable Integer productColorId) {
        List<ProductSizeResponse> response = productSizeService.findByProductColorId(productColorId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleProductSizeStatus(@PathVariable Integer id) {
        try {
            ProductSizeResponse response = productSizeService.toggleProductSizeStatus(id);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Product size not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }
}
