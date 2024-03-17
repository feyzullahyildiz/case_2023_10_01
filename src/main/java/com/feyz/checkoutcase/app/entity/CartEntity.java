package com.feyz.checkoutcase.app.entity;

import java.util.ArrayList;

public class CartEntity {
    private final ArrayList<CartItemEntity> items = new ArrayList<>();

    private Integer appliedPromotionId = null;
    private double totalDiscount = 0;

    public void addItem(CartItemEntity item) {
        // check, increase quantity if exists
        var sameItem = this.items.stream().filter(baseItemEntity -> baseItemEntity.getItemId() == item.getItemId())
                .findFirst();
        if (sameItem.isPresent()) {
            sameItem.get().increaseQuantity(item.getQuantity());
            return;
        }
        this.items.add(item);
    }

    public int getTotalQuantity() {
        return this.getItems().stream().reduce(0, (total, next) -> total + next.getTotalQuantity(), Integer::sum);
    }

    /**
     * UNIQUE ITEM COUNT without counting quantity value
     */
    public int getTotalIdCount() {
        return this.getItems().size();
    }

    public ArrayList<CartItemEntity> getItems() {
        return this.items;
    }

    public int getTotalQuantityByType(ItemEntityType type) {
        if (type == ItemEntityType.VasItem) {
            return this.items.stream()
                    .filter(item -> item.getItemEntityType() == ItemEntityType.Default)
                    .reduce(0, (total, next) -> total + ((DefaultItemEntity) next).getVasItemTotalQuantity(),
                            Integer::sum);

        }
        return this.items.stream()
                .filter(item -> item.getItemEntityType() == type)
                .reduce(0, (total, next) -> total + next.getQuantity(), Integer::sum);
    }

    public Integer getQuantityOfDefaultOrDigitalItem(int id) {
        var item = this.items.stream().filter(next -> next.getItemId() == id).findFirst();
        if (!item.isPresent()) {
            return null;
        }
        return item.get().getQuantity();
    }

    public double getAmount() {
        return this.items.stream().reduce(0.0, (total, next) -> total + next.getAmount(), Double::sum);
    }

    public double getDiscountAppliedAmount() {
        return this.getAmount() - this.getTotalDiscount();
    }

    public DefaultItemEntity getDefaultItemById(int id) {
        var defaultItem = this.items.stream()
                .filter(item -> item.getItemEntityType() == ItemEntityType.Default && item.getItemId() == id)
                .findFirst();
        if (defaultItem.isEmpty()) {
            return null;
        }
        return (DefaultItemEntity) defaultItem.get();
    }

    public boolean addVasItemToItem(int itemId, int vasItemId, int vasCategoryId, int vasSellerId, double price,
            int quantity) {
        var parent = this.getDefaultItemById(itemId);
        if (parent == null) {
            return false;
        }
        parent.addVasItem(vasItemId, vasCategoryId, vasSellerId, price, quantity);
        return true;
    }

    public boolean hasItem(int itemId) {
        for (CartItemEntity item : this.items) {
            if (item.getItemId() == itemId) {
                return true;
            }
            if (item instanceof DefaultItemEntity) {
                var defaultItem = (DefaultItemEntity) item;
                if (defaultItem.hasVasItem(itemId)) {
                    return true;
                }
            }
        }
        return false;
    }

    public void removeItemIfExists(int itemId) {
        var foundItem = this.items.stream().filter(item -> item.getItemId() == itemId).findFirst();
        if (foundItem.isPresent()) {
            this.items.remove(foundItem.get());
        }
        this.items.stream()
                .filter(item -> item.getItemEntityType() == ItemEntityType.Default)
                .map(item -> (DefaultItemEntity) item)
                .forEach(item -> item.removeSubItemIfExists(itemId));
    }

    public void applyPromotion(int promotionId, double discount) {
        this.appliedPromotionId = promotionId;
        this.totalDiscount = discount;
    }

    public void removePromotion() {
        this.appliedPromotionId = null;
        this.totalDiscount = 0;
    }

    public Integer getAppliedPromotionId() {
        return this.appliedPromotionId;
    }

    public double getTotalDiscount() {
        return this.totalDiscount;
    }
}
