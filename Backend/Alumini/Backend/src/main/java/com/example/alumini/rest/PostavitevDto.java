package com.example.alumini.rest;

import com.example.alumini.vao.AlbumSlike;

public record PostavitevDto(
        Integer slikaId,
        double x,
        double y,
        double width,
        double height,
        double rotation,
        int zIndex) {

    public static PostavitevDto from(AlbumSlike a) {
        return new PostavitevDto(a.getSlika().getId(), a.getX(), a.getY(),
                a.getWidth(), a.getHeight(), a.getRotation(), a.getZIndex());
    }
}