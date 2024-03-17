package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class MaxQuantityExceedInCartError extends BaseError {

    public MaxQuantityExceedInCartError() {
        super(ErrorMessage.MAX_QUANTITY_VALUE_EXCEEDED_IN_CART);
    }

}
