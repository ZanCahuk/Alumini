package com.example.alumini.vao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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


    public Slike( Integer id ,String name, String type, String size){
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;

    }

    public Slike(){
    }





}
