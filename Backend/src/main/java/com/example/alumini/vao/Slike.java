package com.example.alumini.vao;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;


@Data
@Entity

public class Slike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    String name;
    String type;
    String size;
    
    @JsonIgnore  
    private byte[] podatkiSlike;

    private LocalDateTime datumNalaganja;


    public Slike( Integer id ,String name, String type, String size, byte[] podatkiSlike){
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.datumNalaganja = LocalDateTime.now();
        this.podatkiSlike = podatkiSlike;

    }

    public Slike(){

        this.datumNalaganja = LocalDateTime.now();
    }
}
