package com.example.alumini.rest;

import com.example.alumini.dao.AlbumSlikeDao;
import com.example.alumini.dao.AlbumiDao;
import com.example.alumini.dao.SlikeDao;
import com.example.alumini.vao.AlbumSlike;
import com.example.alumini.vao.Albumi;
import com.example.alumini.vao.Slike;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AlbumSlikeController {

    @Autowired
    private AlbumSlikeDao dao;

    @Autowired
    private AlbumiDao albumiDao;

    @Autowired
    private SlikeDao slikeDao;

    @GetMapping("/albumi/{id}/slike")
    public List<PostavitevDto> getPostavitev(@PathVariable("id") Integer id) {
        return dao.findByAlbumIdOrderByZIndex(id).stream()
                .map(PostavitevDto::from)
                .toList();
    }

    // Zamenja celotno postavitev albuma s seznamom, ki ga pošlje urejevalnik.
    @PutMapping("/albumi/{id}/slike")
    @Transactional
    public List<PostavitevDto> shraniPostavitev(@PathVariable("id") Integer id,
                                                @RequestBody List<PostavitevDto> postavitev) {
        Albumi album = albumiDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Album ne obstaja"));

        dao.deleteByAlbumId(id);

        List<AlbumSlike> nove = postavitev.stream().map(p -> {
            Slike slika = slikeDao.findById(p.slikaId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slika ne obstaja"));
            AlbumSlike a = new AlbumSlike();
            a.setAlbum(album);
            a.setSlika(slika);
            a.setX(p.x());
            a.setY(p.y());
            a.setWidth(p.width());
            a.setHeight(p.height());
            a.setRotation(p.rotation());
            a.setZIndex(p.zIndex());
            return a;
        }).toList();

        return dao.saveAll(nove).stream().map(PostavitevDto::from).toList();
    }
}