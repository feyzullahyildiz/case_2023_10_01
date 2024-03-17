package com.feyz.checkoutcase.app.command_results;

import com.google.gson.annotations.Expose;

import lombok.Data;

public abstract @Data class BaseCommandResult<T> {
    @Expose(serialize = true, deserialize = true)
    private boolean result;
    @Expose(serialize = true, deserialize = true)
    private T message;

    @Expose(serialize = false, deserialize = false)
    private String errorMessage;

    public BaseCommandResult(boolean result, T payload, String errorMessage) {
        this.result = result;
        this.message = payload;
        this.errorMessage = errorMessage;
    }

    public BaseCommandResult(boolean result, T payload) {
        this.result = result;
        this.message = payload;
        this.errorMessage = null;
    }

    public boolean isSuccess() {
        return this.result;
    }

    public T getPayload() {
        return this.message;
    }
}
