package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class MaxAmountExceedInCartError extends BaseError {

    public MaxAmountExceedInCartError() {
        super(ErrorMessage.MAX_AMOUNT_EXCEEDED_IN_CART);
    }

}
