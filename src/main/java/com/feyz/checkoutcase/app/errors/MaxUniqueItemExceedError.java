package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class MaxUniqueItemExceedError extends BaseError {

    public MaxUniqueItemExceedError() {
        super(ErrorMessage.MAX_UNIQUE_ITEM_EXCEED_ITEM_ERROR);
    }

}
