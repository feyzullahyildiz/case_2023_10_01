package com.feyz.checkoutcase.app.entity;

public class DigitalItemEntity implements CartItemEntity {
    @lombok.Getter
    private int itemId;
    @lombok.Getter
    private int categoryId;
    @lombok.Getter
    private int sellerId;
    @lombok.Getter
    private double price;
    @lombok.Getter
    private int quantity;

    public DigitalItemEntity(int itemId, int categoryId, int sellerId, double price, int quantity) {
        this.itemId = itemId;
        this.categoryId = categoryId;
        this.sellerId = sellerId;
        this.price = price;
        this.quantity = quantity;
    }

    public ItemEntityType getItemEntityType() {
        return ItemEntityType.Digital;
    }

    @Override
    public double getAmount() {
        return this.quantity * this.price;
    }

    @Override
    public void increaseQuantity(int quantity) {
        this.quantity += quantity;
    }

    @Override
    public int getTotalQuantity() {
        return this.getQuantity();
    }
}
