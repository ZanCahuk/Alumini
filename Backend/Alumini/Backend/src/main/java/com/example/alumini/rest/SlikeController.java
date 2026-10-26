package com.example.alumini.rest;

import com.example.alumini.dao.SlikeDao;
import com.example.alumini.vao.Slike;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class SlikeController {

    @Autowired
    private SlikeDao dao;

    @PostMapping("/slike")
    public void addSlike(@RequestBody Slike s) {
        dao.save(s);
    }

    @PostMapping("/slike/bulk")
    public Iterable<Slike> addMoreSlike(@RequestBody List<Slike> slike) {
        return dao.saveAll(slike);
    }

    @GetMapping("/slike")
    public Iterable<Slike> getSlike() {
        return dao.findAll();
    }

    @GetMapping("/slike/{id}")
    public Slike getSlike(@PathVariable("id") Integer id){
        return dao.findById(id).get();
    }

    @GetMapping("/slike/iskanje")
    public PagedModel<Slike> iskanje(
            @RequestParam(defaultValue = "") String q,
            @PageableDefault(size = 5, sort = "id") Pageable pageable) {
        return new PagedModel<>(
                dao.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(q, q, pageable));
    }

    @PutMapping("/slike/{id}")
    public Slike updateSlike(@PathVariable("id") Integer id, @RequestBody Slike s){
        s.setId(id);
        return dao.save(s);
    }

    @DeleteMapping("/slike/{id}")
    public void deleteSlike(@PathVariable Integer id) {

        dao.deleteById(id);
    }

    @DeleteMapping("/slike")
    public void deleteAllSlike() {
        dao.deleteAll();
    }

}
