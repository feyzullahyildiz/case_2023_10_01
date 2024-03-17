package com.feyz.checkoutcase.app.commands;

import com.feyz.checkoutcase.app.commands.payloads.RemoveItemPayload;

public class RemoveItemCommand extends BaseCommand<RemoveItemPayload> {

    public RemoveItemCommand(RemoveItemPayload payload) {
        super("removeItem", payload);
    }
}
