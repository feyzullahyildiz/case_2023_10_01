package com.feyz.checkoutcase.app.commands;

import com.feyz.checkoutcase.app.commands.payloads.AddItemPayload;

public class AddItemCommand extends BaseCommand<AddItemPayload> {

    public AddItemCommand(AddItemPayload payload) {
        super("addItem", payload);
    }
    
}
