package com.feyz.checkoutcase.app.commands;

import com.feyz.checkoutcase.app.commands.payloads.AddVasItemToItemPayload;

public class AddVasItemToItemCommand extends BaseCommand<AddVasItemToItemPayload> {

    public AddVasItemToItemCommand(AddVasItemToItemPayload payload) {
        super("addVasItemToItem", payload);
    }
    
}
