package com.feyz.checkoutcase.app.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

import com.feyz.checkoutcase.app.commands.payloads.AddItemPayload;
import com.feyz.checkoutcase.app.commands.payloads.AddVasItemToItemPayload;
import com.feyz.checkoutcase.app.entity.CartEntity;
import com.feyz.checkoutcase.app.entity.CartItemEntity;
import com.feyz.checkoutcase.app.entity.DefaultItemEntity;
import com.feyz.checkoutcase.app.entity.DigitalItemEntity;
import com.feyz.checkoutcase.app.entity.ItemEntityType;
import com.feyz.checkoutcase.app.services.Rules;

@Repository
public class CartRepository extends BaseRepository<CartEntity> {

    @Autowired
    private Rules rules;

    public void initEntity(String uuid) {
        this.add(uuid, new CartEntity());
    }

    public CartEntity get(String uuid) {
        return super.get(uuid);
    }

    public void resetCart(String uuid) {
        this.remove(uuid);
        this.initEntity(uuid);
    }

    public void addItemToCart(String uuid, AddItemPayload payload) {
        var entity = this.get(uuid);
        var item = this.getItemEntityFromPayload(payload);
        entity.addItem(item);
    }

    public int getTotalQuantity(String uuid) {
        var entity = this.get(uuid);
        return entity.getTotalQuantity();
    }

    public double getAmount(String uuid) {
        var entity = this.get(uuid);
        return entity.getAmount();
    }
    public double getDiscountAppliedAmount(String uuid) {
        var entity = this.get(uuid);
        return entity.getDiscountAppliedAmount();
    }

    /**
     * UNIQUE ITEM COUNT without counting quantity value
     */
    public int getTotalIdCount(String uuid) {
        // A cart can contain a maximum of 10 unique items (excluding VasItems).
        var entity = this.get(uuid);
        return entity.getTotalIdCount();
    }

    public ArrayList<CartItemEntity> getItems(String uuid) {
        var entity = this.get(uuid);
        return entity.getItems();
    }

    public int getTotalQuantityByType(String uuid, ItemEntityType type) {
        var entity = this.get(uuid);
        return entity.getTotalQuantityByType(type);
    }

    private CartItemEntity getItemEntityFromPayload(AddItemPayload payload) {
        if (this.rules.isDefaultItem(payload.getCategoryId(), payload.getSellerId())) {
            return new DefaultItemEntity(
                    payload.getItemId(),
                    payload.getCategoryId(),
                    payload.getSellerId(),
                    payload.getPrice(),
                    payload.getQuantity());
        }
        return new DigitalItemEntity(
                payload.getItemId(),
                payload.getCategoryId(),
                payload.getSellerId(),
                payload.getPrice(),
                payload.getQuantity());
    }

    public Integer getQuantityOfDefaultOrDigitalItem(String uuid, int itemId) {
        var entity = this.get(uuid);
        return entity.getQuantityOfDefaultOrDigitalItem(itemId);
    }

    public DefaultItemEntity getDefaultItemById(String uuid, int itemId) {
        var entity = this.get(uuid);
        return entity.getDefaultItemById(itemId);
    }

    public boolean addVasItemToItem(String uuid, AddVasItemToItemPayload payload) {
        var entity = this.get(uuid);
        return entity.addVasItemToItem(payload.getItemId(),
                payload.getVasItemId(),
                payload.getVasCategoryId(),
                payload.getVasSellerId(),
                payload.getPrice(),
                payload.getQuantity());
    }

    public boolean hasItem(String uuid, int itemId) {
        var entity = this.get(uuid);
        return entity.hasItem(itemId);
    }

    public void removeItem(String uuid, int itemId) {
        var entity = this.get(uuid);
        entity.removeItemIfExists(itemId);
    }

    public void applyPromotion(String uuid, int promotionId, double discount) {
        var entity = this.get(uuid);
        entity.applyPromotion(promotionId, discount);
    }

    public void removePromotion(String uuid) {
        var entity = this.get(uuid);
        entity.removePromotion();
    }

    public Integer getAppliedPromotionId(String uuid) {
        return this.get(uuid).getAppliedPromotionId();
    }

    public double getTotalDiscount(String uuid) {
        return this.get(uuid).getTotalDiscount();
    }
}
