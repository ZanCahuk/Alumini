package com.example.alumini.rest;

import com.example.alumini.dao.SlikeDao;
import com.example.alumini.vao.Slike;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/slike/{name}")
    public Slike getSlike(@PathVariable("name") String name){
        return dao.findById(name).get();
    }

    @PutMapping("/slike/{name}")
    public Slike updateSlike(@PathVariable("name") String name, @RequestBody Slike s){
        s.setName(name);
        return dao.save(s);
    }

    @DeleteMapping("/slike/{name}")
    public void deleteSlike(@PathVariable String name) {

        dao.deleteById(name);
    }

    @DeleteMapping("/slike")
    public void deleteAllSlike() {
        dao.deleteAll();
    }

}
