package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class NotVasItemError extends BaseError {

    public NotVasItemError() {
        super(ErrorMessage.NOT_A_VAS_ITEM);
    }

}
