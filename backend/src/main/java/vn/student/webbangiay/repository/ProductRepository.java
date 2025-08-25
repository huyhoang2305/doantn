package vn.student.webbangiay.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import vn.student.webbangiay.model.Product;

@Repository  
public interface ProductRepository extends JpaRepository<Product, Integer>{
     Optional<Product> findByProductName(String productName);
     
     // Count active products by brand
     long countByBrandBrandIdAndIsActiveTrue(Integer brandId);
     
     // Count active products by subcategory
     long countBySubCategorySubCategoryIdAndIsActiveTrue(Integer subCategoryId);
     
     // Deactivate all products by brand
     @Modifying
     @Transactional
     @Query("UPDATE Product p SET p.isActive = false WHERE p.brand.brandId = :brandId")
     void deactivateProductsByBrand(@Param("brandId") Integer brandId);
     
     // Deactivate all products by subcategory
     @Modifying
     @Transactional
     @Query("UPDATE Product p SET p.isActive = false WHERE p.subCategory.subCategoryId = :subCategoryId")
     void deactivateProductsBySubCategory(@Param("subCategoryId") Integer subCategoryId);
}
