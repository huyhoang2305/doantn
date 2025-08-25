package vn.student.webbangiay.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "guest")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guest_id")
    private Integer guestId;

    @Column(name = "full_name", length = 50, columnDefinition = "NVARCHAR(50)")
    private String fullName;

    @Column(name = "email", length = 255, columnDefinition = "NVARCHAR(255)")
    private String email;

    @Column(name = "phone", length = 15, columnDefinition = "NVARCHAR(15)")
    private String phone;

    @Column(name = "address", length = 255, columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "address2", length = 255, columnDefinition = "NVARCHAR(255)")
    private String address2;

    @Column(name = "city", length = 50, columnDefinition = "NVARCHAR(50)")
    private String city;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @OneToMany(mappedBy = "guest", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Order> orders;
}
