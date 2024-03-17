package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class InvalidItemError extends BaseError {

    public InvalidItemError() {
        super(ErrorMessage.NOT_A_VAS_ITEM);
    }

}
