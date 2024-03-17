package com.feyz.checkoutcase.app.util;

import org.springframework.beans.factory.annotation.Autowired;

import com.feyz.checkoutcase.app.cart.CartAggragate;
import com.feyz.checkoutcase.app.command_results.AddItemCommandResult;
import com.feyz.checkoutcase.app.command_results.AddVasItemToItemCommandResult;
import com.feyz.checkoutcase.app.services.Rules;

public class TestUtil {
    @Autowired
    Rules rules;

    public AddItemCommandResult addVasFiendlyDefaultItem(CartAggragate cart, int id, double price, int quantity) {
        var categoryId = rules.getVasItemFriendlyDefaultItemCategoryId();
        var sellerId = rules.getRandomDefaultItemSellerId();
        return cart.addItem(id, categoryId, sellerId, price, quantity);
    }

    public AddItemCommandResult addDefaultItem(CartAggragate cart, int id, double price, int quantity) {
        var categoryId = rules.getRandomDefaultItemCategoryId();
        var sellerId = rules.getRandomDefaultItemSellerId();
        return cart.addItem(id, categoryId, sellerId, price, quantity);
    }

    public AddItemCommandResult addDefaultItem(CartAggragate cart, int id, int categoryId, int sellerId, double price,
            int quantity) {
        return cart.addItem(id, categoryId, sellerId, price, quantity);
    }

    public AddItemCommandResult addDigitalItem(CartAggragate cart, int id, double price, int quantity) {
        var categoryId = rules.getRandomDigitalItemCategoryId();
        var sellerId = rules.getRandomDigitalItemSellerId();
        return cart.addItem(id, categoryId, sellerId, price, quantity);
    }

    public AddVasItemToItemCommandResult addVasItem(CartAggragate cart, int itemId,
            int vasItemId,
            double price,
            int quantity) {
        var vasCategoryId = this.rules.getVasItemCategoryId();
        var vasSellerId = this.rules.getVasItemSellerId();
        return cart.addVasItemToItem(itemId, vasItemId, vasCategoryId, vasSellerId, price, quantity);
    }

}
