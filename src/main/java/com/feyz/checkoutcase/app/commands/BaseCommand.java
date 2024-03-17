package com.feyz.checkoutcase.app.commands;

import lombok.Data;

public @Data class BaseCommand<T> {
    String command;
    T payload;
    public BaseCommand(String command, T payload) {
        this.command = command;
        this.payload = payload;
    }
}
