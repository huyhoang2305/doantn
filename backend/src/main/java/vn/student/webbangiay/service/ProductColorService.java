package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.student.webbangiay.dto.ProductColorDto;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.model.Product;
import vn.student.webbangiay.model.ProductColor;
import vn.student.webbangiay.repository.ProductColorRepository;
import vn.student.webbangiay.repository.ProductRepository;
import vn.student.webbangiay.response.ProductColorResponse;



import java.io.IOException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductColorService {

    @Autowired
    private ProductColorRepository productColorRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileService fileService; // AWS S3 Service

    private final String productColorFolder = "product_color"; // S3 base folder path
    private static final String BASE_URL = "http://localhost:8080/uploads/";

    public List<ProductColorResponse> findAll() {
        List<ProductColor> productColors = productColorRepository.findAll();
        return productColors.stream()
                .map(this::mapToProductColorResponse)  // Map to response in the service
                .collect(Collectors.toList());
    }

    public ProductColorResponse findById(Integer id) {
        ProductColor productColor = productColorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with id: " + id));
        return mapToProductColorResponse(productColor);  // Map to response in the service
    }

    public ProductColorResponse createProductColor(ProductColorDto productColorDto) throws IOException {
        ProductColor productColor = new ProductColor();
        productColor.setColorName(productColorDto.getColorName());

        // Fetching Product
        Product product = productRepository.findById(productColorDto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productColorDto.getProductId()));

        productColor.setProduct(product);

        // Handle file upload to S3
        if (productColorDto.getImageFile() != null && !productColorDto.getImageFile().isEmpty()) {
            String imageUrl = uploadImageToS3(productColorDto.getProductId(), productColorDto.getImageFile());
            productColor.setImageUrl(imageUrl);
        }

        // Save to the repository and return the mapped response
        ProductColor savedProductColor = productColorRepository.save(productColor);
        return mapToProductColorResponse(savedProductColor); // Map and return the response
    }

    public ProductColorResponse updateProductColor(Integer id, ProductColorDto productColorDto) throws IOException {
        ProductColor existingColor = productColorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with id: " + id));
        
        existingColor.setColorName(productColorDto.getColorName());

        // Handle file upload to S3 if a new image is provided
        if (productColorDto.getImageFile() != null && !productColorDto.getImageFile().isEmpty()) {
            String imageUrl = uploadImageToS3(productColorDto.getProductId(), productColorDto.getImageFile());
            existingColor.setImageUrl(imageUrl);
        }

        // Save to the repository and return the mapped response
        ProductColor updatedProductColor = productColorRepository.save(existingColor);
        return mapToProductColorResponse(updatedProductColor); // Map and return the response
    }

    public void deleteProductColor(Integer id) {
        ProductColor existingColor = productColorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with id: " + id));

        productColorRepository.delete(existingColor);
    }

    public List<ProductColorResponse> findByProduct_ProductId(Integer productId) {
        List<ProductColor> productColors = productColorRepository.findByProduct_ProductId(productId);
        return productColors.stream()
                .map(this::mapToProductColorResponse)
                .collect(Collectors.toList());
    }

    public ProductColorResponse toggleProductColorStatus(Integer id) {
        ProductColor existingColor = productColorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product color not found with id: " + id));

        boolean newStatus = !existingColor.getIsActive();
        existingColor.setIsActive(newStatus);

        // If deactivating the color, also deactivate all its sizes
        if (!newStatus) {
            existingColor.getProductSizes().forEach(size -> {
                size.setIsActive(false);
            });
        }

        ProductColor updatedProductColor = productColorRepository.save(existingColor);
        return mapToProductColorResponse(updatedProductColor);
    }

    // Method to map ProductColor entity to ProductColorResponse DTO
    private ProductColorResponse mapToProductColorResponse(ProductColor productColor) {
        ProductColorResponse response = new ProductColorResponse();
        response.setProductColorId(productColor.getProductColorId());
        response.setColorName(productColor.getColorName());
        response.setIsActive(productColor.getIsActive());
        
        // Only add BASE_URL if the image URL doesn't already contain http
        String imageUrl = productColor.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty() &&
            !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            response.setImageUrl(BASE_URL + imageUrl);
        } else {
            response.setImageUrl(imageUrl);
        }
        
        return response;
    }

    private String uploadImageToS3(Integer productId, MultipartFile file) throws IOException {
        // Generate a unique file name (UUID + original file extension)
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name cannot be empty");
        }
    
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
    
        // Construct the S3 key (folder path + file name)
        String s3Key = String.format("%s/p%d/", productColorFolder, productId);
    
        fileService.uploadFile(s3Key, uniqueFileName, file.getInputStream(), file.getSize(), file.getContentType());

        // Return the relative URL for the file (URL to access the file from S3)
        return s3Key + uniqueFileName;  // The full URL can be generated based on the S3 bucket configuration
    }
    

}
