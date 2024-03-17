package com.feyz.checkoutcase.app.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.command_results.AddItemCommandResult;
import com.feyz.checkoutcase.app.commands.AddItemCommand;
import com.feyz.checkoutcase.app.commands.payloads.AddItemPayload;
import com.feyz.checkoutcase.app.eventhandler.AddItemEventHandler;

public class AddItemEvent extends BaseEvent<AddItemCommand, AddItemCommandResult, AddItemPayload> {
    @Autowired
    AddItemEventHandler handler;

    public AddItemEvent(AutowireCapableBeanFactory beanFactory, AddItemCommand command) {
        super(beanFactory, command, BaseEventType.CRUD);
    }

    @Override
    protected AddItemEventHandler getHandler() {
        return this.handler;
    }

}
