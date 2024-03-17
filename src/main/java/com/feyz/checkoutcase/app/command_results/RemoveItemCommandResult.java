package com.feyz.checkoutcase.app.command_results;

public class RemoveItemCommandResult extends BaseCommandResult<String> {
    public RemoveItemCommandResult(boolean result, String message) {
        super(result, message);
    }

    public RemoveItemCommandResult(boolean result, String payload, String errorMessage) {
        super(result, payload, errorMessage);
    }

    public static RemoveItemCommandResult failure(String errorMessage) {
        return new RemoveItemCommandResult(false, null, errorMessage);
    }

    public static RemoveItemCommandResult success(String message) {
        return new RemoveItemCommandResult(true, message, null);
    }
}
