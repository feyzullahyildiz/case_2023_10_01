package com.feyz.checkoutcase.app.command_results;

public class AddItemCommandResult extends BaseCommandResult<String> {

    public AddItemCommandResult(boolean result, String payload) {
        super(result, payload, null);
    }
    public AddItemCommandResult(boolean result, String payload, String errorMessage) {
        super(result, payload, errorMessage);
    }

    public static AddItemCommandResult failure(String errorMessage) {
        return new AddItemCommandResult(false, null, errorMessage);
    }
    public static AddItemCommandResult success(String message) {
        return new AddItemCommandResult(true, message, null);
    }
}
