package vn.student.webbangiay.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.webbangiay.model.Brand;
import vn.student.webbangiay.model.Category;
import vn.student.webbangiay.model.Gender;
import vn.student.webbangiay.model.Product;
import vn.student.webbangiay.model.ProductColor;
import vn.student.webbangiay.model.ProductColorImage;
import vn.student.webbangiay.model.ProductSize;
import vn.student.webbangiay.model.SubCategory;
import vn.student.webbangiay.repository.BrandRepository;
import vn.student.webbangiay.repository.CategoryRepository;
import vn.student.webbangiay.repository.ProductColorImageRepository;
import vn.student.webbangiay.repository.ProductColorRepository;
import vn.student.webbangiay.repository.ProductRepository;
import vn.student.webbangiay.repository.ProductSizeRepository;
import vn.student.webbangiay.repository.SubCategoryRepository;

import java.util.Date;

@Component
@Configuration
public class ProductDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ProductDataSeeder.class);

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository, BrandRepository brandRepository, SubCategoryRepository subCategoryRepository, CategoryRepository categoryRepository, ProductColorRepository productColorRepository, ProductSizeRepository productSizeRepository, ProductColorImageRepository productColorImageRepository) {
        return args -> {
            if (productRepository.count() == 0) { // Prevents duplicate entries

                // Retrieve or create shoe brands
                Brand nike = findOrCreateBrand(brandRepository, "Nike", "https://picsum.photos/200/100?random=1");
                Brand adidas = findOrCreateBrand(brandRepository, "Adidas", "https://picsum.photos/200/100?random=2");
                Brand converse = findOrCreateBrand(brandRepository, "Converse", "https://picsum.photos/200/100?random=3");
                Brand vans = findOrCreateBrand(brandRepository, "Vans", "https://picsum.photos/200/100?random=4");
                Brand puma = findOrCreateBrand(brandRepository, "Puma", "https://picsum.photos/200/100?random=5");

                Category giayCasualCategory = findOrCreateCategory(categoryRepository, "Giày Casual");
                Category giayTheThaoCategory = findOrCreateCategory(categoryRepository, "Giày Thể Thao");

                // Retrieve or create subcategories for shoes
                SubCategory sneakerNam = findOrCreateSubCategory(subCategoryRepository, "Sneaker Nam", giayCasualCategory, Gender.MALE);
                SubCategory sneakerNu = findOrCreateSubCategory(subCategoryRepository, "Sneaker Nữ", giayCasualCategory, Gender.FEMALE);
                SubCategory giayCaoCoNam = findOrCreateSubCategory(subCategoryRepository, "Giày Cao Cổ Nam", giayCasualCategory, Gender.MALE);
                SubCategory giayCaoCoNu = findOrCreateSubCategory(subCategoryRepository, "Giày Cao Cổ Nữ", giayCasualCategory, Gender.FEMALE);
                SubCategory giayChayBoNam = findOrCreateSubCategory(subCategoryRepository, "Giày Chạy Bộ Nam", giayTheThaoCategory, Gender.MALE);
                SubCategory giayChayBoNu = findOrCreateSubCategory(subCategoryRepository, "Giày Chạy Bộ Nữ", giayTheThaoCategory, Gender.FEMALE);
                SubCategory giayBongDaNam = findOrCreateSubCategory(subCategoryRepository, "Giày Bóng Đá Nam", giayTheThaoCategory, Gender.MALE);
                SubCategory giayBongDaNu = findOrCreateSubCategory(subCategoryRepository, "Giày Bóng Đá Nữ", giayTheThaoCategory, Gender.FEMALE);
                SubCategory giayBasketballNam = findOrCreateSubCategory(subCategoryRepository, "Giày Basketball Nam", giayTheThaoCategory, Gender.MALE);
                SubCategory giayBasketballNu = findOrCreateSubCategory(subCategoryRepository, "Giày Basketball Nữ", giayTheThaoCategory, Gender.FEMALE);
                
                // Add Nike shoes
                Product p1 = addProduct(productRepository, nike, sneakerNam, "Nike Air Force 1 '07", 2929000);
       
                String[] p1Images = {
                    "https://picsum.photos/600/600?random=11",
                    "https://picsum.photos/600/600?random=12",
                    "https://picsum.photos/600/600?random=13"
                };

                String[] p1Sizes = {"39", "40", "41", "42", "43"};
                Integer[] p1StockQuantities = {15, 20, 25, 18, 12};

                addProductColor(
                    productColorRepository,
                    productColorImageRepository,
                    productSizeRepository,
                    p1,
                    "Trắng",
                    "https://picsum.photos/600/600?random=10",
                    p1Images,
                    p1Sizes,
                    p1StockQuantities
                );
                                
                Product p2 = addProduct(productRepository, nike, sneakerNam, "Nike Air Max 90", 3499000);

                String[] p2Images = {
                    "https://picsum.photos/600/600?random=21",
                    "https://picsum.photos/600/600?random=22",
                    "https://picsum.photos/600/600?random=23",
                    "https://picsum.photos/600/600?random=24"
                };

                String[] p2Sizes = {"38", "39", "40", "41", "42", "43", "44"};
                Integer[] p2StockQuantities = {10, 15, 20, 25, 20, 15, 10};

                addProductColor(
                    productColorRepository,
                    productColorImageRepository,
                    productSizeRepository,
                    p2,
                    "Đen",
                    "https://picsum.photos/600/600?random=20",
                    p2Images,
                    p2Sizes,
                    p2StockQuantities
                );

                Product p3 = addProduct(productRepository, adidas, sneakerNam, "Adidas Stan Smith", 2799000);

                String[] p3Images = {
                    "https://picsum.photos/600/600?random=31",
                    "https://picsum.photos/600/600?random=32",
                    "https://picsum.photos/600/600?random=33"
                };

                String[] p3Sizes = {"39", "40", "41", "42", "43"};
                Integer[] p3StockQuantities = {12, 18, 20, 15, 8};

                addProductColor(
                    productColorRepository,
                    productColorImageRepository,
                    productSizeRepository,
                    p3,
                    "Trắng Xanh",
                    "https://picsum.photos/600/600?random=30",
                    p3Images,
                    p3Sizes,
                    p3StockQuantities
                );

                Product p4 = addProduct(productRepository, converse, sneakerNu, "Converse Chuck Taylor All Star", 1890000);

                
                String[] p4Images = {
                    "https://picsum.photos/600/600?random=41",
                    "https://picsum.photos/600/600?random=42",
                    "https://picsum.photos/600/600?random=43",
                    "https://picsum.photos/600/600?random=44",
                    "https://picsum.photos/600/600?random=45"
                };

                String[] p4Sizes = {"35", "36", "37", "38", "39"};
                Integer[] p4StockQuantities = {15, 18, 20, 22, 16};

                addProductColor(
                    productColorRepository,
                    productColorImageRepository,
                    productSizeRepository,
                    p4,
                    "Đỏ",
                    "https://picsum.photos/600/600?random=40",
                    p4Images,
                    p4Sizes,
                    p4StockQuantities
                );

                Product p5 = addProduct(productRepository, vans, sneakerNu, "Vans Old Skool", 2199000);
                String[] p5Images = {
                    "https://picsum.photos/600/600?random=51",
                    "https://picsum.photos/600/600?random=52",
                    "https://picsum.photos/600/600?random=53",
                    "https://picsum.photos/600/600?random=54"
                };
                String[] p5Sizes = {"35", "36", "37", "38", "39", "40"};
                Integer[] p5StockQuantities = {10, 12, 15, 18, 14, 10};

                addProductColor(
                    productColorRepository,
                    productColorImageRepository,
                    productSizeRepository,
                    p5,
                    "Đen Trắng",
                    "https://picsum.photos/600/600?random=50",
                    p5Images,
                    p5Sizes,
                    p5StockQuantities
                );
                Product p6 = addProduct(productRepository, puma, giayCaoCoNam, "Puma Suede Classic", 2490000);
                String[] p6Images = {
                  
                    "https://picsum.photos/600/600?random=61",
                    "https://picsum.photos/600/600?random=62",
                    "https://picsum.photos/600/600?random=63",
                    "https://picsum.photos/600/600?random=64",
                    "https://picsum.photos/600/600?random=65"
                };
                String[] p6Sizes = {"40", "41", "42", "43"};
                Integer[] p6StockQuantities = {8, 12, 15, 10};

                addProductColor(
                    productColorRepository,
                    productColorImageRepository,
                    productSizeRepository,
                    p6,
                    "Xanh Navy",
                    "https://picsum.photos/600/600?random=60",
                    p6Images,
                    p6Sizes,
                    p6StockQuantities
                );
                Product p7 = addProduct(productRepository, nike, giayChayBoNam, "Nike Air Zoom Pegasus 38", 3299000);
                String[] p7Images = {
                    "https://picsum.photos/600/600?random=71",
                    "https://picsum.photos/600/600?random=72",
                    "https://picsum.photos/600/600?random=73"
                };
                String[] p7Sizes = {"40", "41", "42", "43", "44"};
                Integer[] p7StockQuantities = {5, 8, 12, 10, 6};

                addProductColor(
                    productColorRepository,
                    productColorImageRepository,
                    productSizeRepository,
                    p7,
                    "Xám",
                    "https://picsum.photos/600/600?random=70",
                    p7Images,
                    p7Sizes,
                    p7StockQuantities
                );

                // Additional shoe products with placeholder images and Vietnamese names
                Product p8 = addProduct(productRepository, adidas, giayChayBoNu, "Adidas Ultraboost 22", 4199000);
                Product p9 = addProduct(productRepository, nike, giayBongDaNam, "Nike Mercurial Vapor 14", 5299000);
                Product p10 = addProduct(productRepository, puma, giayBasketballNam, "Puma Clyde All-Pro", 3799000);
                Product p11 = addProduct(productRepository, converse, giayCaoCoNu, "Converse Chuck 70 High Top", 2390000);
                Product p12 = addProduct(productRepository, vans, sneakerNam, "Vans Authentic", 1799000);
                Product p13 = addProduct(productRepository, adidas, sneakerNu, "Adidas Gazelle", 2599000);
                Product p14 = addProduct(productRepository, nike, giayBasketballNu, "Nike Air Jordan 1 Low", 3199000);
                Product p15 = addProduct(productRepository, puma, giayBongDaNu, "Puma Future 7 Play", 2999000);
                Product p16 = addProduct(productRepository, nike, sneakerNu, "Nike Dunk Low", 2799000);
                Product p17 = addProduct(productRepository, adidas, giayCaoCoNam, "Adidas Forum High", 3299000);
                Product p18 = addProduct(productRepository, converse, sneakerNam, "Converse One Star", 2199000);
                Product p19 = addProduct(productRepository, vans, giayCaoCoNu, "Vans SK8-Hi", 2499000);
                Product p20 = addProduct(productRepository, puma, sneakerNam, "Puma RS-X", 3499000);
                Product p21 = addProduct(productRepository, nike, giayChayBoNam, "Nike React Infinity Run", 3799000);
                Product p22 = addProduct(productRepository, adidas, giayChayBoNu, "Adidas Solar Glide", 3199000);
                Product p23 = addProduct(productRepository, nike, giayBongDaNam, "Nike Phantom GT2", 4899000);
                Product p24 = addProduct(productRepository, puma, giayBasketballNam, "Puma MB.01", 3999000);
                Product p25 = addProduct(productRepository, converse, sneakerNu, "Converse Platform Chuck Taylor", 2590000);
                Product p26 = addProduct(productRepository, vans, sneakerNam, "Vans Era", 1999000);
                Product p27 = addProduct(productRepository, adidas, sneakerNu, "Adidas Superstar", 2399000);
                Product p28 = addProduct(productRepository, nike, giayCaoCoNam, "Nike Blazer Mid '77", 2899000);
                Product p29 = addProduct(productRepository, puma, giayChayBoNu, "Puma Deviate Nitro", 4199000);
                Product p30 = addProduct(productRepository, converse, giayBongDaNu, "Converse All Star Pro BB", 3299000);

                logger.info("Shoe products seeded successfully!");
            }
        };
    }

    private Brand findOrCreateBrand(BrandRepository brandRepository, String brandName, String imageUrl) {
        return brandRepository.findByBrandName(brandName)
            .orElseGet(() -> {
                Brand brand = new Brand();
                brand.setBrandName(brandName);
                brand.setImageUrl(imageUrl);
                brand.setCreatedAt(new Date());
                brand.setUpdatedAt(new Date());
                return brandRepository.save(brand);
            });
    }

    private SubCategory findOrCreateSubCategory(SubCategoryRepository subCategoryRepository, String subCategoryName, Category category, Gender gender) {
        return subCategoryRepository.findBySubCategoryName(subCategoryName)
            .orElseGet(() -> {
                SubCategory subCategory = new SubCategory();
                subCategory.setSubCategoryName(subCategoryName);
                subCategory.setCategory(category);
                subCategory.setCreatedAt(new Date());
                subCategory.setUpdatedAt(new Date());
                subCategory.setGender(gender);
                return subCategoryRepository.save(subCategory);
            });
    }

    private Category findOrCreateCategory(CategoryRepository categoryRepository, String categoryName) {
        return categoryRepository.findByCategoryName(categoryName)
            .orElseGet(() -> {
                Category category = new Category();
                category.setCategoryName(categoryName);
                category.setCreatedAt(new Date());
                category.setUpdatedAt(new Date());
                return categoryRepository.save(category);
            });
    }

    private Product addProduct(ProductRepository productRepository, Brand brand, SubCategory subCategory, String productName, long price) {
        Product product = new Product();
        product.setProductName(productName);
        product.setOriginalPrice(price);
        product.setUnitPrice(price);
        product.setBrand(brand);
        product.setSubCategory(subCategory);
        product.setCreatedAt(new Date());
        product.setUpdatedAt(new Date());
        return productRepository.save(product);
    }


    // Modified addProductColor to include sizes and stock quantities
    private void addProductColor(
        ProductColorRepository productColorRepository,
        ProductColorImageRepository productColorImageRepository,
        ProductSizeRepository productSizeRepository,
        Product product,
        String colorName,
        String imageUrl,
        String[] imageUrls,
        String[] sizeValues,
        Integer[] stockQuantities
    ) {
        ProductColor productColor = new ProductColor();
        productColor.setProduct(product);
        productColor.setColorName(colorName);
        productColor.setImageUrl(imageUrl);
        productColor = productColorRepository.save(productColor);  // Save the ProductColor first
        
        // Add images to the product color
        for (String imgUrl : imageUrls) {
            addProductColorImage(productColorImageRepository, productColor, imgUrl);
        }
        
        // Add sizes and stock quantities to the product color
        for (int i = 0; i < sizeValues.length; i++) {
            addProductSize(productSizeRepository, productColor, sizeValues[i], stockQuantities[i]);
        }
        
    }

    // Adding images to the product color
    private void addProductColorImage(ProductColorImageRepository productColorImageRepository, ProductColor productColor, String imageUrl) {
        ProductColorImage productColorImage = new ProductColorImage();
        productColorImage.setProductColor(productColor);
        productColorImage.setImageUrl(imageUrl);
        productColorImageRepository.save(productColorImage);
    }

    // Adding sizes to the product color
    private void addProductSize(ProductSizeRepository productSizeRepository, ProductColor productColor, String sizeValue, Integer stockQuantity) {
        ProductSize productSize = new ProductSize();
        productSize.setSizeValue(sizeValue);
        productSize.setStockQuantity(stockQuantity);
        productSize.setProductColor(productColor);
        productSizeRepository.save(productSize);
    }


}
