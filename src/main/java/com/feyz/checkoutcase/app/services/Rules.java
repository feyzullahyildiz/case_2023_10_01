package com.feyz.checkoutcase.app.services;

import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.stereotype.Component;

@Component
public class Rules {
    public final int MAX_ALLOWED_AMOUNT_LIMIT_IN_CART = 500000;

    public final int MAX_ALLOWED_DIGITAL_ITEM_QUANTITY_IN_CART = 5;

    public final int MAX_ALLOWED_QUANTITY = 10;

    // Carttaki MAX VAS ITEM 10 diyebiliriz. (The maximum quantity of an item that
    // can be added is 10);
    public final int MAX_ALLOWED_VAS_ITEM_QUANTITY_IN_CART = 10;

    public final int MAX_ALLOWED_QUANTITY_IN_CART = 30;

    public final int MAX_ALLOWED_UNIQUE_ID_COUNT_IN_CART = 10;

    public final int MAX_ALLOWED_VAS_QUANTITY_IN_A_DEFAULT_ITEM = 3;

    private final int VAS_ITEM_CATEGORY_ID = 3242;
    private final int VAS_ITEM_SELLER_ID = 5003;

    private final int DIGITAL_ITEM_CATEGORY_ID = 7889;

    private final ArrayList<Integer> VAS_ADDABLE_CATEGORY_IDS = new ArrayList<>(Arrays.asList(1001, 3004));

    public final PromotionRules promotions = new PromotionRules();

    public boolean isDefaultItem(int categoryId, int sellerId) {
        if (!this.isValidItem(categoryId, sellerId)) {
            return false;
        }
        if (this.isVasItem(categoryId, sellerId)) {
            return false;
        }
        if (this.isDigitalItem(categoryId, sellerId)) {
            return false;
        }
        return true;
    }

    public boolean isValidItem(int categoryId, int sellerId) {
        if (categoryId == this.VAS_ITEM_CATEGORY_ID && sellerId == this.VAS_ITEM_SELLER_ID) {
            // valid vas item
            return true;
        }
        if (categoryId == this.VAS_ITEM_CATEGORY_ID || sellerId == this.VAS_ITEM_SELLER_ID) {
            // invalid like-vas item
            return false;
        }

        return true;
    }

    public boolean isVasItem(int categoryId, int sellerId) {
        return categoryId == this.VAS_ITEM_CATEGORY_ID && sellerId == this.VAS_ITEM_SELLER_ID;
    }

    public boolean isVasAddable(int categoryId, int sellerId) {
        if (!this.isDefaultItem(categoryId, sellerId)) {
            return false;
        }
        return this.VAS_ADDABLE_CATEGORY_IDS.contains(categoryId);
    }

    public boolean isDigitalItem(int categoryId, int sellerId) {
        if (!this.isValidItem(categoryId, sellerId)) {
            return false;
        }
        return categoryId == this.DIGITAL_ITEM_CATEGORY_ID;
    }

    public int getRandomDefaultItemCategoryId() {
        return 100;
    }

    public int getVasItemFriendlyDefaultItemCategoryId() {
        return this.VAS_ADDABLE_CATEGORY_IDS.stream().findAny().get();
    }

    public int getRandomDefaultItemSellerId() {
        return 100;
    }

    public int getRandomDigitalItemCategoryId() {
        return this.DIGITAL_ITEM_CATEGORY_ID;
    }

    public int getRandomDigitalItemSellerId() {
        return 100;
    }

    public int getVasItemCategoryId() {
        return this.VAS_ITEM_CATEGORY_ID;
    }

    public int getVasItemSellerId() {
        return this.VAS_ITEM_SELLER_ID;
    }

    public static class PromotionRules {

        public CategoryPromotion categoryPromotion = new CategoryPromotion();
        public BasePromotion sameSellerPromotion = new BasePromotion() {
            @Override
            public int getID() {
                return 9909;
            }

            @Override
            public double discountFuntion(double value) {
                return value * 0.1;
            }
        };
        public BasePromotion totalPricePromotion = new BasePromotion() {
            @Override
            public int getID() {
                return 1232;
            }

            @Override
            public double discountFuntion(double value) {
                if (value >= 50_000) {
                    return 2000;
                }
                if (value >= 10_000) {
                    return 1000;
                }
                if (value >= 5_000) {
                    return 500;
                }
                if (value >= 500) {
                    return 250;
                }
                return 0;
            }
        };

        public interface BasePromotion {
            int getID();

            double discountFuntion(double value);
        }

        public class CategoryPromotion implements BasePromotion {
            @Override
            public int getID() {
                return 5676;
            }

            public int getCategoryId() {
                return 3003;
            }

            @Override
            public double discountFuntion(double value) {
                return value * 0.05;
            }

        }

    }
}
