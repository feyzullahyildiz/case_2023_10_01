package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class MaxQuantityExceedForVasItemsInCart extends BaseError {

    public MaxQuantityExceedForVasItemsInCart() {
        super(ErrorMessage.MAX_VAS_ITEM_QUANTITY_VALUE_EXCEEDED_IN_CART);
    }

}
