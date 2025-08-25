package vn.student.webbangiay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.webbangiay.model.Banner;

@Repository  
public interface BannerRepository extends JpaRepository<Banner, Integer> {
}
