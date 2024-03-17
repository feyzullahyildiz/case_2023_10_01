package com.feyz.checkoutcase.app.command_results;

import lombok.Data;

@Data
public class ErrorCommandResult {
    private boolean result = false;
    private String message;

    public ErrorCommandResult(String errMessage) {
        this.message = errMessage;
    }
}
