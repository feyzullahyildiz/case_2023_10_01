package com.feyz.checkoutcase.app.entity;

public interface BaseItemEntity {
    double price = 0;
    int quantity = 0;

    public ItemEntityType getItemEntityType();

    public int getQuantity();
    public int getTotalQuantity();

    public int getItemId();

    public double getAmount();

    public void increaseQuantity(int quantity);
}