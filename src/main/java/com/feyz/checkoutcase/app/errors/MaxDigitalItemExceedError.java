package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class MaxDigitalItemExceedError extends BaseError {

    public MaxDigitalItemExceedError() {
        super(ErrorMessage.MAX_DIGITAL_ITEM_EXCEED_ERROR);
    }

}
