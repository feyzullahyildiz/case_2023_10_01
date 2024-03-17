package com.feyz.checkoutcase.app.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.command_results.AddVasItemToItemCommandResult;
import com.feyz.checkoutcase.app.commands.AddVasItemToItemCommand;
import com.feyz.checkoutcase.app.commands.payloads.AddVasItemToItemPayload;
import com.feyz.checkoutcase.app.eventhandler.AddVasItemToItemEventHandler;

public class AddVasItemToItemEvent
        extends BaseEvent<AddVasItemToItemCommand, AddVasItemToItemCommandResult, AddVasItemToItemPayload> {

    @Autowired
    AddVasItemToItemEventHandler handler;

    public AddVasItemToItemEvent(AutowireCapableBeanFactory beanFactory, AddVasItemToItemCommand command) {
        super(beanFactory, command, BaseEventType.CRUD);
    }

    @Override
    protected AddVasItemToItemEventHandler getHandler() {
        return this.handler;
    }

}
