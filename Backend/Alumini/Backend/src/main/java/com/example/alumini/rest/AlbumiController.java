package com.example.alumini.rest;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import com.example.alumini.dao.AlbumiDao;
import com.example.alumini.vao.Albumi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AlbumiController {

    @Autowired
    private AlbumiDao dao;

    @PostMapping("/albumi")
    public void addAlbumi(@RequestBody Albumi a) {
        dao.save(a);
    }

    // @PostMapping("/albumi/bulk")
    // public Iterable<Albumi> addMoreAlbumi(@RequestBody List<Albumi> albumi) {
    //     return dao.saveAll(albumi);
    // }

    @GetMapping("/albumi")
    public Iterable<Albumi> getAlbumi() {
        return dao.findAll();
    }

    @GetMapping("/albumi/{id}")
    public Albumi getAlbumi(@PathVariable("id") Integer id) {
        return dao.findById(id).get();
    }

@GetMapping("/albumi/iskanje")
public PagedModel<Albumi> iskanje(
        @RequestParam(defaultValue = "") String q,
        @PageableDefault(size = 5, sort = "id") Pageable pageable) {

    return new PagedModel<>(
            dao.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                    q, q, pageable));
}

    @PutMapping("/albumi/{id}")
    public Albumi updateAlbumi(@PathVariable("id") Integer id,
                               @RequestBody Albumi a) {
        a.setId(id);
        return dao.save(a);
    }

    @DeleteMapping("/albumi/{id}")
    public void deleteAlbumi(@PathVariable Integer id) {
        dao.deleteById(id);
    }

    @DeleteMapping("/albumi")
    public void deleteAllAlbumi() {
        dao.deleteAll();
    }
}