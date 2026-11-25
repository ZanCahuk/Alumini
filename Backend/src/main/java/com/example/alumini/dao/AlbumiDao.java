package com.example.alumini.dao;

import com.example.alumini.vao.Albumi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumiDao extends JpaRepository<Albumi, Integer> {

    Page<Albumi> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description, Pageable pageable);
}