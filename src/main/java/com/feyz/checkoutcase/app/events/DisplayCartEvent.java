package com.feyz.checkoutcase.app.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.command_results.DisplayCartCommandResult;
import com.feyz.checkoutcase.app.commands.DisplayCartCommand;
import com.feyz.checkoutcase.app.eventhandler.DisplayCartEventHandler;

public class DisplayCartEvent extends BaseEvent<DisplayCartCommand, DisplayCartCommandResult, Object> {

    @Autowired
    DisplayCartEventHandler handler;

    public DisplayCartEvent(AutowireCapableBeanFactory beanFactory, DisplayCartCommand command) {
        super(beanFactory, command, BaseEventType.READONLY);
    }

    @Override
    protected DisplayCartEventHandler getHandler() {
        return this.handler;
    }

}
