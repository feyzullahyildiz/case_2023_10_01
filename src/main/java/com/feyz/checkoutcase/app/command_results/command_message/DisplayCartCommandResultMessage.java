package com.feyz.checkoutcase.app.command_results.command_message;

import java.util.ArrayList;

import com.feyz.checkoutcase.app.entity.CartItemEntity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DisplayCartCommandResultMessage {

    ArrayList<CartItemEntity> items;
    double totalAmount;
    Integer appliedPromotionId;
    double totalDiscount;
}
