package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.student.webbangiay.dto.CategoryDto;
import vn.student.webbangiay.model.Category;
import vn.student.webbangiay.repository.CategoryRepository;
import vn.student.webbangiay.repository.SubCategoryRepository;
import vn.student.webbangiay.response.CategoryResponse;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .map(this::mapToCategoryResponse)
                .orElse(null);
    }

    public boolean isCategoryNameExists(String categoryName) {
        return categoryRepository.existsByCategoryName(categoryName);
    }

    public boolean isCategoryNameExistsForOtherId(String categoryName, Integer categoryId) {
        return categoryRepository.existsByCategoryNameAndCategoryIdNot(categoryName, categoryId);
    }

    public CategoryResponse createCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setCategoryName(categoryDto.getCategoryName());
        category.setCreatedAt(new Date());
        category.setUpdatedAt(new Date());
        Category savedCategory = categoryRepository.save(category);
        return mapToCategoryResponse(savedCategory);
    }

    public CategoryResponse updateCategory(Integer categoryId, CategoryDto categoryDto) {
        Optional<Category> optionalCategory = categoryRepository.findById(categoryId);
        if (optionalCategory.isEmpty()) {
            return null; 
        }

        Category category = optionalCategory.get();


        category.setCategoryName(categoryDto.getCategoryName());
        category.setUpdatedAt(new Date());
        Category updatedCategory = categoryRepository.save(category);
        return mapToCategoryResponse(updatedCategory);
    }

    public boolean deleteCategory(Integer categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            return false; 
        }
        categoryRepository.deleteById(categoryId);
        return true; 
    }

    public Category toggleCategoryStatus(Integer id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            throw new RuntimeException("Category not found with ID: " + id);
        }

        Category category = optionalCategory.get();

        // Nếu đang active và muốn deactivate, kiểm tra xem có subcategory nào đang active không
        if (category.getIsActive() && hasActiveSubCategories(id)) {
            throw new IllegalStateException("Không thể ngừng hoạt động danh mục này vì đang có danh mục con hoạt động!");
        }

        category.setIsActive(!category.getIsActive());
        category.setUpdatedAt(new Date());
        return categoryRepository.save(category);
    }

    private boolean hasActiveSubCategories(Integer categoryId) {
        return subCategoryRepository.countByCategoryCategoryIdAndIsActiveTrue(categoryId) > 0;
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getIsActive(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
