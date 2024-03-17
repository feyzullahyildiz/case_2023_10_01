package com.feyz.checkoutcase.app.errors;

public abstract class BaseError extends RuntimeException {
    public BaseError(String message) {
        super(message);
    }
}
