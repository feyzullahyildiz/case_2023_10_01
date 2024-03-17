package com.feyz.checkoutcase.app.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.command_results.ResetCartCommandResult;
import com.feyz.checkoutcase.app.commands.ResetCartCommand;
import com.feyz.checkoutcase.app.eventhandler.ResetCartEventHandler;

public class ResetCartEvent extends BaseEvent<ResetCartCommand, ResetCartCommandResult, String> {

    @Autowired
    private ResetCartEventHandler handler;

    public ResetCartEvent(AutowireCapableBeanFactory beanFactory, ResetCartCommand command) {
        super(beanFactory, command, BaseEventType.CRUD);
    }

    @Override
    protected ResetCartEventHandler getHandler() {
        return this.handler;
    }

}
