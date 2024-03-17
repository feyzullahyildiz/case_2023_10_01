package com.feyz.checkoutcase.app.command_results;

import com.feyz.checkoutcase.app.command_results.command_message.DisplayCartCommandResultMessage;

public class DisplayCartCommandResult extends BaseCommandResult<DisplayCartCommandResultMessage> {
    public DisplayCartCommandResult(boolean result, DisplayCartCommandResultMessage message) {
        super(result, message);
    }
}
