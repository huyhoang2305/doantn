package vn.student.webbangiay.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.webbangiay.model.ProductSize;

@Repository  
public interface ProductSizeRepository extends JpaRepository<ProductSize, Integer>{
    List<ProductSize> findByProductColor_ProductColorId(Integer productColorId);
}
