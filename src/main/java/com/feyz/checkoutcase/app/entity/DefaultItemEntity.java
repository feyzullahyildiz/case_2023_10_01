package com.feyz.checkoutcase.app.entity;

import java.util.ArrayList;

public class DefaultItemEntity implements CartItemEntity {

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
    private ArrayList<VasItemEntity> vasItems = new ArrayList<>();

    public DefaultItemEntity(int itemId, int categoryId, int sellerId, double price, int quantity) {
        this.itemId = itemId;
        this.categoryId = categoryId;
        this.sellerId = sellerId;
        this.price = price;
        this.quantity = quantity;
    }

    public ItemEntityType getItemEntityType() {
        return ItemEntityType.Default;
    }

    public int getVasItemTotalQuantity() {
        return this.vasItems.stream().reduce(0, (total, next) -> total + next.getQuantity(), Integer::sum);
    }

    public int getTotalQuantity() {
        return this.getQuantity() + this.getVasItemTotalQuantity();
    }

    public void addVasItem(int vasItemId, int vasCategoryId, int vasSellerId, double price, int quantity) {
        var vasItem = this.vasItems.stream().filter(item -> item.getVasItemId() == vasItemId).findFirst();
        if (vasItem.isPresent()) {
            // ADD
            vasItem.get().increaseQuantity(quantity);
            return;
        }
        var newVasItem = new VasItemEntity(this.getItemId(), vasItemId, vasCategoryId, vasSellerId, price, quantity);
        this.vasItems.add(newVasItem);
    }

    @Override
    public void increaseQuantity(int quantity) {
        this.quantity += quantity;
    }

    @Override
    public double getAmount() {
        var vasAmount = this.vasItems.stream().reduce(0.0, (total, next) -> total + next.getAmount(), Double::sum);
        return (this.quantity * this.price) + vasAmount;
    }

    public boolean hasVasItem(int itemId) {
        var vasItem = this.vasItems.stream().filter(item -> item.getVasItemId() == itemId).findFirst();
        return vasItem.isPresent();
    }

    public void removeSubItemIfExists(int itemId) {
        var vasItem = this.vasItems.stream().filter(item -> item.getVasItemId() == itemId).findFirst();
        if (vasItem.isEmpty()) {
            return;
        }
        this.vasItems.remove(vasItem.get());
    }
}
