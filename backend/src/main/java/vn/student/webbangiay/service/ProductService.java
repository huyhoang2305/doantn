package vn.student.webbangiay.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.student.webbangiay.dto.ProductDto;
import vn.student.webbangiay.response.ProductResponse;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.model.Product;
import vn.student.webbangiay.model.ProductColor;
import vn.student.webbangiay.model.Brand;
import vn.student.webbangiay.model.Gender;
import vn.student.webbangiay.model.SubCategory;
import vn.student.webbangiay.repository.ProductRepository;
import vn.student.webbangiay.repository.BrandRepository;
import vn.student.webbangiay.repository.ProductColorRepository;
import vn.student.webbangiay.repository.SubCategoryRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private ProductColorRepository productColorRepository;
    private static final String BASE_URL = "http://localhost:8080/uploads/";
    // Create a new product
    public ProductResponse createProduct(ProductDto productDto) {
        // Fetching Brand
        Brand brand = brandRepository.findById(productDto.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + productDto.getBrandId()));

        // Fetching SubCategory
        SubCategory subCategory = subCategoryRepository.findById(productDto.getSubCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found with ID: " + productDto.getSubCategoryId()));

        Product product = new Product();
        product.setProductName(productDto.getProductName());
        product.setOriginalPrice(productDto.getOriginalPrice());
        product.setUnitPrice(productDto.getUnitPrice());
        product.setBrand(brand);  // Setting the fetched brand
        product.setSubCategory(subCategory);  // Setting the fetched subcategory
        product.setCreatedAt(new Date());
        product.setUpdatedAt(new Date());

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    // Get product by ID
    public ProductResponse getProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapToResponse(product);
    }

    // Update a product
    public ProductResponse updateProduct(Integer productId, ProductDto productDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Fetching and updating brand if provided
        Brand brand = brandRepository.findById(productDto.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + productDto.getBrandId()));

        // Fetching and updating subcategory if provided
        SubCategory subCategory = subCategoryRepository.findById(productDto.getSubCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found with ID: " + productDto.getSubCategoryId()));

        product.setProductName(productDto.getProductName());
        product.setOriginalPrice(productDto.getOriginalPrice());
        product.setUnitPrice(productDto.getUnitPrice());
        product.setBrand(brand);  // Updating the brand
        product.setSubCategory(subCategory);  // Updating the subcategory
        product.setUpdatedAt(new Date());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    // Delete a product
    public void deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
    }

    public Product toggleProductStatus(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Kiểm tra xem brand và subcategory của sản phẩm có đang active không
        if (!product.getIsActive()) { // Nếu muốn activate sản phẩm
            if (!product.getBrand().getIsActive()) {
                throw new IllegalStateException("Không thể kích hoạt sản phẩm này vì thương hiệu đã ngừng hoạt động!");
            }
            if (!product.getSubCategory().getIsActive()) {
                throw new IllegalStateException("Không thể kích hoạt sản phẩm này vì danh mục con đã ngừng hoạt động!");
            }
            if (!product.getSubCategory().getCategory().getIsActive()) {
                throw new IllegalStateException("Không thể kích hoạt sản phẩm này vì danh mục cha đã ngừng hoạt động!");
            }
        }

        product.setIsActive(!product.getIsActive());
        product.setUpdatedAt(new Date());
        return productRepository.save(product);
    }

      // Get all products with filtering and search functionality
    public List<ProductResponse> getAllProducts(Integer subCategoryId, Gender gender, String productName) {
        List<Product> products = productRepository.findAll();

        // Apply filtering by subCategoryId (integer)
        if (subCategoryId != null) {
            products = products.stream()
                    .filter(product -> product.getSubCategory() != null &&
                                      product.getSubCategory().getSubCategoryId().equals(subCategoryId))
                    .collect(Collectors.toList());
        }

        // Apply filtering by Gender (enum)
        if (gender != null) {
            products = products.stream()
                    .filter(product -> product.getSubCategory() != null &&
                                      product.getSubCategory().getGender() != null &&
                                      product.getSubCategory().getGender().equals(gender))
                    .collect(Collectors.toList());
        }

        // Apply search by product name
        if (productName != null && !productName.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getProductName().toLowerCase().contains(productName.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Convert Product entities to ProductResponse DTOs
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
 private ProductResponse mapToResponse(Product product) {
        // Fetch images associated with the product
        List<ProductColor> images = productColorRepository.findByProduct_ProductId(product.getProductId());
        String imageUrl = null; // Default image URL

        // If there are images associated with the product, find the first one
        if (!images.isEmpty()) {
            imageUrl = BASE_URL + images.get(0).getImageUrl(); // Use the first image found
        }

        return new ProductResponse(
            product.getProductId(),
            product.getProductName(),
            product.getOriginalPrice(),
            product.getUnitPrice(),
            product.getSubCategory().getSubCategoryName(),
            product.getBrand().getBrandName(),
            product.getBrand().getBrandId(), // Set brandId
            product.getSubCategory().getSubCategoryId(), // Set subCategoryId
            product.getIsActive(), // Set isActive
            product.getSubCategory().getGender().toString(),
            product.getCreatedAt(),
            product.getUpdatedAt(),
            imageUrl // Include image URL in response
        );
    }

}
