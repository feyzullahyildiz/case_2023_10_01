package com.feyz.checkoutcase.app.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.command_results.RemoveItemCommandResult;
import com.feyz.checkoutcase.app.commands.RemoveItemCommand;
import com.feyz.checkoutcase.app.commands.payloads.RemoveItemPayload;
import com.feyz.checkoutcase.app.eventhandler.RemoveItemEventHandler;

public class RemoveItemEvent extends BaseEvent<RemoveItemCommand, RemoveItemCommandResult, RemoveItemPayload> {

    @Autowired
    private RemoveItemEventHandler handler;
    public RemoveItemEvent(AutowireCapableBeanFactory beanFactory, RemoveItemCommand command) {
        super(beanFactory, command, BaseEventType.CRUD);
    }

    @Override
    protected RemoveItemEventHandler getHandler() {
        return this.handler;
    }
    
}
