package com.airlinebooking.entity;

public enum Tier {
    STANDARD(0),
    PLUS(5),
    PREMIUM(10);

    private final int markupPercentage;

    Tier(int markupPercentage) {
        this.markupPercentage = markupPercentage;
    }

    public int getMarkupPercentage() {
        return markupPercentage;
    }
}
