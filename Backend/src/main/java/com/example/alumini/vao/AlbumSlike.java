package com.example.alumini.vao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "album_slike")
public class AlbumSlike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Albumi album;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "slika_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Slike slika;

    // Položaj in velikost v logičnih enotah platna (1200 x 800).
    private double x;
    private double y;
    private double width;
    private double height;

    // Rezervirano za kasnejšo uporabo (stopinje).
    private double rotation = 0;

    private int zIndex;

    public AlbumSlike() {
    }
}