package vn.student.webbangiay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.student.webbangiay.model.ProductColor;

import java.util.List;

@Repository  
public interface ProductColorRepository extends JpaRepository<ProductColor, Integer> {
    
    List<ProductColor> findByProduct_ProductId(Integer productId); // Custom method for finding by product ID
}
