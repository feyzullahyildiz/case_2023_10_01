package com.feyz.checkoutcase.app.entity;

public class VasItemEntity implements BaseItemEntity {
    @lombok.Getter
    private int itemId;
    @lombok.Getter
    private int vasItemId;
    @lombok.Getter
    private int vasCategoryId;
    @lombok.Getter
    private int vasSellerId;
    @lombok.Getter
    private double price;
    @lombok.Getter
    private int quantity;

    public VasItemEntity(int itemId, int vasItemId, int vasCategoryId, int vasSellerId, double price, int quantity) {
        this.itemId = itemId;
        this.vasItemId = vasItemId;
        this.vasCategoryId = vasCategoryId;
        this.vasSellerId = vasSellerId;
        this.price = price;
        this.quantity = quantity;
    }

    public ItemEntityType getItemEntityType() {
        return ItemEntityType.VasItem;
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
