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

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "customer", schema = "dbo", catalog = "web-ban-giay")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;


    @Column(name = "full_name", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String fullName;

    @Column(name = "email", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String email;

    @Column(name = "hash_password", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String hashPassword;

    @Column(name = "email_confirmed", nullable = false)
    private Boolean emailConfirmed;

    @Column(name = "phone", nullable = false, length = 15, columnDefinition = "NVARCHAR(15)")
    private String phone;

    @Column(name = "address", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "address2", length = 255, columnDefinition = "NVARCHAR(255)")
    private String address2;

    @Column(name = "city", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String city;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Order> orders;

        @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return hashPassword;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("CUSTOMER"));
    }
    
}
