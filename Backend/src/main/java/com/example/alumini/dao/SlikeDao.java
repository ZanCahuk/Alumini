package com.example.alumini.dao;

import com.example.alumini.vao.Slike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
// import org.springframework.data.repository.CrudRepository;


public interface SlikeDao extends JpaRepository<Slike, Integer> {

    Page<Slike> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(
            String name, String type, Pageable pageable);

    Optional<Slike> findById(Integer Id);

}
