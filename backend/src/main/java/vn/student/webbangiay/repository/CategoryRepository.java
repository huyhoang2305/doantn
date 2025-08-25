package vn.student.webbangiay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.student.webbangiay.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsByCategoryName(String categoryName);

    boolean existsByCategoryNameAndCategoryIdNot(String categoryName, Integer categoryId);

    Optional<Category> findByCategoryName(String categoryName);
    
    List<Category> findByIsActiveTrue();
}
