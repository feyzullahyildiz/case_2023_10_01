package com.feyz.checkoutcase.app.command_results;

public class AddVasItemToItemCommandResult extends BaseCommandResult<String> {
    public AddVasItemToItemCommandResult(boolean result, String message) {
        super(result, message, null);
    }

    public AddVasItemToItemCommandResult(boolean result, String payload, String errorMessage) {
        super(result, payload, errorMessage);
    }

    public static AddVasItemToItemCommandResult failure(String errorMessage) {
        return new AddVasItemToItemCommandResult(false, null, errorMessage);
    }

    public static AddVasItemToItemCommandResult success(String message) {
        return new AddVasItemToItemCommandResult(true, message, null);
    }
}
