package com.example.alumini.rest;

import com.example.alumini.dao.SlikeDao;
import com.example.alumini.services.SlikeService;
import com.example.alumini.vao.Slike;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/slike")
public class SlikeController {

    @Autowired
    private SlikeDao dao;

    @Autowired
    private SlikeService slikaService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "ime", required = false) String ime) {

        Map<String, Object> odziv = new HashMap<>();
        try {
            Slike s = slikaService.shraniSliko(file, ime);
            odziv.put("uspelo", true);
            odziv.put("id", s.getId());
            odziv.put("ime", s.getName());
            odziv.put("velikost", s.getSize());
            return ResponseEntity.ok(odziv);
        } catch (IOException e) {
            odziv.put("uspelo", false);
            odziv.put("napaka", e.getMessage());
            return ResponseEntity.badRequest().body(odziv);
        }
    }

    @GetMapping
    public List<Slike> getSlike() {
        return dao.findAll();
    }

    @GetMapping("/iskanje")
    public PagedModel<Slike> iskanje(
            @RequestParam(defaultValue = "") String q,
            @PageableDefault(size = 5, sort = "id") Pageable pageable) {
        return new PagedModel<>(
                dao.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(q, q, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Slike> getSlika(@PathVariable Integer id) {
        return dao.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/prejmi/{id}")
    public ResponseEntity<ByteArrayResource> getImageData(@PathVariable Integer id) {
        Optional<Slike> opt = dao.findById(id);
        if (opt.isEmpty() || opt.get().getPodatkiSlike() == null) {
            return ResponseEntity.notFound().build();
        }
        Slike s = opt.get();

        MediaType tip = switch (s.getType() == null ? "" : s.getType().toLowerCase()) {
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png" -> MediaType.IMAGE_PNG;
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };

        return ResponseEntity.ok()
                .contentType(tip)
                .body(new ByteArrayResource(s.getPodatkiSlike()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Slike> updateSlika(@PathVariable Integer id,@RequestBody Map<String, String> body) {
        return dao.findById(id).map(s -> {
            String name = body.get("name");
            if (name != null && !name.isBlank()) {
                s.setName(name.trim());
            }
            return ResponseEntity.ok(dao.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlika(@PathVariable Integer id) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dao.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}