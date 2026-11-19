package com.example.alumini.dao;

import com.example.alumini.vao.AlbumSlike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AlbumSlikeDao extends JpaRepository<AlbumSlike, Integer> {

    @Query("select a from AlbumSlike a where a.album.id = :albumId order by a.zIndex")
    List<AlbumSlike> findByAlbumIdOrderByZIndex(@Param("albumId") Integer albumId);

    @Modifying
    @Query("delete from AlbumSlike a where a.album.id = :albumId")
    void deleteByAlbumId(@Param("albumId") Integer albumId);
}