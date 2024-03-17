package com.feyz.checkoutcase.app.command_results;

public class ResetCartCommandResult extends BaseCommandResult<String> {
    public ResetCartCommandResult(boolean result, String message) {
        super(result, message);
    }

    public ResetCartCommandResult(boolean result, String payload, String errorMessage) {
        super(result, payload, errorMessage);
    }

    public static ResetCartCommandResult failure(String errorMessage) {
        return new ResetCartCommandResult(false, null, errorMessage);
    }

    public static ResetCartCommandResult success(String message) {
        return new ResetCartCommandResult(true, message, null);
    }
}
