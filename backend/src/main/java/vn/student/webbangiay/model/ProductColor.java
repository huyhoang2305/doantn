package vn.student.webbangiay.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "product_color")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_color_id")
    private Integer productColorId;
    
    @Column(name = "color_name", nullable = false, length = 30, columnDefinition = "NVARCHAR(30)")
    private String colorName;

    @Column(name = "image_url", nullable = false, length = 256, columnDefinition = "NVARCHAR(256)")
    private String imageUrl;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @OneToMany(mappedBy = "productColor", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductSize> productSizes;
}
