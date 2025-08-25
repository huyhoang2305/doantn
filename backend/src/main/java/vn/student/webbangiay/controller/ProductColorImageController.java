package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.student.webbangiay.dto.ProductColorImageDto;
import vn.student.webbangiay.model.ProductColorImage;
import vn.student.webbangiay.response.ProductColorImageResponse;
import vn.student.webbangiay.service.ProductColorImageService;

import java.util.List;

@RestController
@RequestMapping("/product-color-images")
public class ProductColorImageController {

    @Autowired
    private ProductColorImageService productColorImageService;

    // Get all images by Product Color ID
    @GetMapping("/color/{productColorId}")
    public ResponseEntity<List<ProductColorImageResponse>> getImagesByProductColorId(@PathVariable Integer productColorId) {
        List<ProductColorImageResponse> productColorImages = productColorImageService.findByProductColorId(productColorId);
        return ResponseEntity.ok(productColorImages);
    }

    // Create new Product Color Images
    @PostMapping
    public ResponseEntity<List<ProductColorImageResponse>> createProductColorImages(@ModelAttribute ProductColorImageDto productColorImageDto) {
        try {
            List<ProductColorImageResponse> createdImages = productColorImageService.createProductColorImages(productColorImageDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdImages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Update existing Product Color Image
    @PutMapping("/{imageId}")
    public ResponseEntity<ProductColorImageResponse> updateProductColorImage(@PathVariable Integer imageId,
                                                                     @ModelAttribute ProductColorImageDto productColorImageDto) {
        try {
            ProductColorImageResponse updatedImage = productColorImageService.updateProductColorImage(imageId, productColorImageDto);
            return ResponseEntity.ok(updatedImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Delete Product Color Image
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteProductColorImage(@PathVariable Integer imageId) {
        try {
            productColorImageService.deleteProductColorImage(imageId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
