package com.feyz.checkoutcase.app.errors;

import com.feyz.checkoutcase.app.message.ErrorMessage;

public class DefaultItemPriceCanBeLowerThanVasItemPrice extends BaseError {

    public DefaultItemPriceCanBeLowerThanVasItemPrice() {
        super(ErrorMessage.DEFAULT_ITEM_CANT_BE_LOWER_THAN_VAS_ITEM_PRICE);
    }

}
