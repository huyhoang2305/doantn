package vn.student.webbangiay.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.student.webbangiay.model.Gender;
import vn.student.webbangiay.model.SubCategory;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer> {
    Optional<SubCategory> findBySubCategoryName(String subCategoryName);
    List<SubCategory> findByCategory_CategoryId(Integer categoryId);
    List<SubCategory> findByGender(Gender gender);
    List<SubCategory> findByCategory_CategoryIdAndGender(Integer categoryId, Gender gender);
    
    // Count active subcategories by category
    long countByCategoryCategoryIdAndIsActiveTrue(Integer categoryId);
    
    // Deactivate all subcategories by category
    @Modifying
    @Transactional
    @Query("UPDATE SubCategory sc SET sc.isActive = false WHERE sc.category.categoryId = :categoryId")
    void deactivateSubCategoriesByCategory(@Param("categoryId") Integer categoryId);
}
