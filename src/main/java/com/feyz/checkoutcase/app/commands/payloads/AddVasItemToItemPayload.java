package com.feyz.checkoutcase.app.commands.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;

public @Data @AllArgsConstructor class AddVasItemToItemPayload {
    // {"itemId":10,"vasItemId":100,"vasCategoryId":500,"vasSellerId":333,"price":10,"quantity":1}
    private int itemId;
    private int vasItemId;
    private int vasCategoryId;
    private int vasSellerId;
    private double price;
    private int quantity;
}
