package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class MaxQuantityExceedForTheActualItemError extends BaseError {

    public MaxQuantityExceedForTheActualItemError() {
        super(ErrorMessage.MAX_QUANTITY_VALUE_EXCEEDED_FOR_THE_ACTUAL_ITEM);
    }

}
