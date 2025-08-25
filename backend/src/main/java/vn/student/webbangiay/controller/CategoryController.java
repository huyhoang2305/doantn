package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import vn.student.webbangiay.dto.CategoryDto;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.response.CategoryResponse;
import vn.student.webbangiay.service.CategoryService;
import vn.student.webbangiay.util.ValidationUtils;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponse>> getActiveCategories() {
        List<CategoryResponse> activeCategories = categoryService.getActiveCategories();
        return ResponseEntity.ok(activeCategories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable("id") Integer categoryId) {
        CategoryResponse categoryResponse = categoryService.getCategoryById(categoryId);
        if (categoryResponse == null) {
            throw new ResourceNotFoundException("Category with ID " + categoryId + " not found");
        }
        return ResponseEntity.ok(categoryResponse);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody @Valid CategoryDto categoryDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }

        if (categoryService.isCategoryNameExists(categoryDto.getCategoryName())) {
            return ResponseEntity.badRequest().body("Category name already exists");
        }

        CategoryResponse createdCategory = categoryService.createCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Integer categoryId, @RequestBody @Valid CategoryDto categoryDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }

        if (categoryService.getCategoryById(categoryId) == null) {
            throw new ResourceNotFoundException("Category with ID " + categoryId + " not found");
        }

        if (categoryService.isCategoryNameExistsForOtherId(categoryDto.getCategoryName(), categoryId)) {
            return ResponseEntity.badRequest().body("Category name already exists for another category");
        }

        CategoryResponse updatedCategory = categoryService.updateCategory(categoryId, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer categoryId) {
        boolean isDeleted = categoryService.deleteCategory(categoryId);
        if (!isDeleted) {
            throw new ResourceNotFoundException("Category with ID " + categoryId + " not found");
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleCategoryStatus(@PathVariable("id") Integer categoryId) {
        try {
            vn.student.webbangiay.model.Category category = categoryService.toggleCategoryStatus(categoryId);
            vn.student.webbangiay.response.ToggleStatusResponse response = 
                new vn.student.webbangiay.response.ToggleStatusResponse(category.getCategoryId(), category.getIsActive());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            vn.student.webbangiay.response.ErrorResponse errorResponse = 
                new vn.student.webbangiay.response.ErrorResponse(e.getMessage(), 400);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
