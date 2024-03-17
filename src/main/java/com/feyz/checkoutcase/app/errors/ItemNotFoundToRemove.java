package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class ItemNotFoundToRemove extends BaseError {

    public ItemNotFoundToRemove() {
        super(ErrorMessage.ITEM_NOT_FOUND_TO_REMOVE);
    }

}
