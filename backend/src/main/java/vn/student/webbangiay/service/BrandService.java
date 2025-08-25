package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.student.webbangiay.dto.BrandDto;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.model.Brand;
import vn.student.webbangiay.repository.BrandRepository;
import vn.student.webbangiay.repository.ProductRepository;



import java.io.IOException;




import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;



@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileService fileService;

    private static final String BASE_URL = "http://localhost:8080/uploads/"; 
    private static final String BRAND_PATH = "brand/";

    public List<Brand> getAllBrands() {
        return brandRepository.findAll().stream()
            .map(brand -> {
                // If the brand has an image URL and doesn't already contain http, prepend the base URL
                if (brand.getImageUrl() != null && !brand.getImageUrl().isEmpty() &&
                    !brand.getImageUrl().startsWith("http://") && !brand.getImageUrl().startsWith("https://")) {
                    brand.setImageUrl(BASE_URL + brand.getImageUrl());
                }
                return brand;
            })
            .collect(Collectors.toList());
    }

    public Brand getBrandById(Integer id) {
        Brand brand = brandRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Brand with ID " + id + " not found"));
        if (brand != null && brand.getImageUrl() != null && !brand.getImageUrl().isEmpty() &&
            !brand.getImageUrl().startsWith("http://") && !brand.getImageUrl().startsWith("https://")) {
            brand.setImageUrl(BASE_URL + brand.getImageUrl());
        }
        return brand;
    }

    public Brand createBrand(BrandDto brandDto) throws IOException {
        Brand brand = new Brand();
        brand.setBrandName(brandDto.getBrandName());

        // Handle image file upload
        if (brandDto.getImageFile() != null && !brandDto.getImageFile().isEmpty()) {
            String imageUrl = uploadFile(brandDto.getImageFile(), BRAND_PATH);
            brand.setImageUrl(imageUrl);
        }

        brand.setCreatedAt(new Date());
        brand.setUpdatedAt(new Date());
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Integer id, BrandDto brandDto) throws IOException {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand with ID " + id + " not found"));

        brand.setBrandName(brandDto.getBrandName());

        // Handle image file upload
        if (brandDto.getImageFile() != null && !brandDto.getImageFile().isEmpty()) {
            String imageUrl = uploadFile(brandDto.getImageFile(), BRAND_PATH);
            brand.setImageUrl(imageUrl);
        }

        brand.setUpdatedAt(new Date());
        return brandRepository.save(brand);
    }

    public void deleteBrand(Integer id) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand with ID " + id + " not found"));

        brandRepository.delete(brand);
    }

    public Brand toggleBrandStatus(Integer id) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand with ID " + id + " not found"));

        // Nếu đang active và muốn deactivate, kiểm tra xem có sản phẩm nào đang sử dụng không
        if (brand.getIsActive() && hasActiveProducts(id)) {
            throw new IllegalStateException("Không thể ngừng hoạt động thương hiệu này vì đang có sản phẩm sử dụng!");
        }

        // Nếu deactivate brand, tất cả sản phẩm thuộc brand này cũng sẽ bị deactivate
        if (brand.getIsActive()) {
            productRepository.deactivateProductsByBrand(id);
        }

        brand.setIsActive(!brand.getIsActive());
        brand.setUpdatedAt(new Date());
        return brandRepository.save(brand);
    }

    private boolean hasActiveProducts(Integer brandId) {
        return productRepository.countByBrandBrandIdAndIsActiveTrue(brandId) > 0;
    }
    public String uploadFile(MultipartFile file, String folderName) throws IOException {
        // Generate a unique file name and construct file path
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String filePath = folderName + uniqueFileName;

        // Upload the file using the FileService
        fileService.uploadFile(folderName, uniqueFileName, file.getInputStream(), file.getSize(), file.getContentType());

        // Return the relative URL for the uploaded file
        return filePath;
    }

}
