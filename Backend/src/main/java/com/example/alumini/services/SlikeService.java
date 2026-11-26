package com.example.alumini.services;
import com.example.alumini.dao.SlikeDao;
import com.example.alumini.vao.Slike;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;

import org.springframework.core.io.ByteArrayResource;

@Service 
public class SlikeService {

    @Autowired 
    private SlikeDao slikeDao;

    public Slike shraniSliko(MultipartFile file, String ime) throws IOException {
        String original = file.getOriginalFilename();
        if (original == null || !original.contains(".")) {
            throw new IOException("Neveljavno ime datoteke.");
        }

        String koncnica = original.substring(original.lastIndexOf('.') + 1).toLowerCase();
        if (!List.of("jpg", "jpeg", "png").contains(koncnica)) {
            throw new IOException("Dovoljene so samo slike (jpg, jpeg, png).");
        }

        Slike nova = new Slike();
        nova.setPodatkiSlike(file.getBytes());
        nova.setName(ime != null && !ime.isBlank() ? ime : original);
        nova.setType(koncnica);
        nova.setSize(String.format("%.2f MB", file.getSize() / 1048576.0));
        nova.setDatumNalaganja(java.time.LocalDateTime.now());

        return slikeDao.save(nova);
    }
    public ByteArrayResource getImageDataById(Integer id) {
        Slike slika = slikeDao.findById(id).orElse(null);
        
        if (slika != null && slika.getPodatkiSlike() != null) {
            ByteArrayResource resource = new ByteArrayResource(slika.getPodatkiSlike());
            
            if ("jpg".equalsIgnoreCase(slika.getType())) {
                resource.getByteArray();
            }
            
            return resource;
        } else {
            throw new RuntimeException("Slika s ID " + id + " ne obstaja.");
        }
    }
}
