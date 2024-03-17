package com.feyz.checkoutcase.app.commands.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddItemPayload {
    private int itemId;
    private int categoryId;
    private int sellerId;
    private double price;
    private int quantity;
}
