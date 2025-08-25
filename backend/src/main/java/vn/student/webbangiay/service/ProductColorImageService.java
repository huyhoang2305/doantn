package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.student.webbangiay.dto.ProductColorImageDto;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.model.ProductColor;
import vn.student.webbangiay.model.ProductColorImage;
import vn.student.webbangiay.repository.ProductColorImageRepository;
import vn.student.webbangiay.repository.ProductColorRepository;
import vn.student.webbangiay.response.ProductColorImageResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductColorImageService {

    @Autowired
    private ProductColorImageRepository productColorImageRepository;

    @Autowired
    private ProductColorRepository productColorRepository;

    @Autowired
    private FileService fileService; // Inject the fileService

    private final String productColorFolder = "product_color"; 
    private static final String BASE_URL = "http://localhost:8080/uploads/";

    // Find all images by ProductColor ID and map to response DTO
    public List<ProductColorImageResponse> findByProductColorId(Integer productColorId) {
        return productColorImageRepository.findAll().stream()
                .filter(image -> image.getProductColor().getProductColorId().equals(productColorId))
                .map(image -> {
                    String imageUrl = image.getImageUrl();
                    String fullUrl = (imageUrl != null && !imageUrl.isEmpty() &&
                        !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) 
                        ? BASE_URL + imageUrl : imageUrl;
                    return new ProductColorImageResponse(image.getProductColorImageId(), fullUrl, image.getProductColor().getProductColorId());
                })
                .collect(Collectors.toList());
    }

    // Create new ProductColorImages and return response DTOs
    public List<ProductColorImageResponse> createProductColorImages(ProductColorImageDto productColorImageDto) throws IOException {
        ProductColor productColor = productColorRepository.findById(productColorImageDto.getProductColorId())
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with ID: " + productColorImageDto.getProductColorId()));

        return productColorImageDto.getImageFiles().stream()
                .map(imageFile -> {
                    try {
                        String relativePath = uploadAndGetRelativePath(productColor.getProductColorId(), imageFile);

                        ProductColorImage productColorImage = new ProductColorImage();
                        productColorImage.setImageUrl(relativePath);
                        productColorImage.setProductColor(productColor);
                        ProductColorImage savedImage = productColorImageRepository.save(productColorImage);

                        return new ProductColorImageResponse(savedImage.getProductColorImageId(), 
                            (relativePath != null && !relativePath.isEmpty() &&
                             !relativePath.startsWith("http://") && !relativePath.startsWith("https://")) 
                             ? BASE_URL + relativePath : relativePath, 
                            productColor.getProductColorId());
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to save image: " + imageFile.getOriginalFilename(), e);
                    }
                }).collect(Collectors.toList());
    }

    // Update existing ProductColorImage and return the updated response DTO
    public ProductColorImageResponse updateProductColorImage(Integer imageId, ProductColorImageDto productColorImageDto) throws IOException {
        ProductColorImage existingImage = productColorImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + imageId));

        if (productColorImageDto.getImageFiles() != null && !productColorImageDto.getImageFiles().isEmpty()) {
            MultipartFile imageFile = productColorImageDto.getImageFiles().get(0);
            String relativePath = uploadAndGetRelativePath(existingImage.getProductColor().getProductColorId(), imageFile);
            existingImage.setImageUrl(relativePath);
        }

        ProductColorImage updatedImage = productColorImageRepository.save(existingImage);
        String imageUrl = updatedImage.getImageUrl();
        String fullUrl = (imageUrl != null && !imageUrl.isEmpty() &&
            !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) 
            ? BASE_URL + imageUrl : imageUrl;
        return new ProductColorImageResponse(updatedImage.getProductColorImageId(), fullUrl, existingImage.getProductColor().getProductColorId());
    }

    // Delete ProductColorImage
    public void deleteProductColorImage(Integer imageId) {
        ProductColorImage existingImage = productColorImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + imageId));

        productColorImageRepository.delete(existingImage);
    }

    // Helper method to upload a file and return the relative path
    private String uploadAndGetRelativePath(Integer productColorId, MultipartFile imageFile) throws IOException {
        String uniqueFileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
        String s3Key = getS3KeyForProductColor(productColorId);
        fileService.uploadFile(s3Key, uniqueFileName, imageFile.getInputStream(), imageFile.getSize(), imageFile.getContentType());
        return String.format("%s/%s", s3Key, uniqueFileName);
    }

    // Helper method to construct S3 key for product color images
    private String getS3KeyForProductColor(Integer productColorId) {
        return String.format("%s/%d", productColorFolder, productColorId);
    }
}
