package com.feyz.checkoutcase.app.commands.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RemoveItemPayload {
    private int itemId;
}
