package vn.student.webbangiay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.webbangiay.model.Guest;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Integer> {
}