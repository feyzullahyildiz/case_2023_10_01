package com.feyz.checkoutcase.app.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.eventhandler.CartCreatedEventHandler;

public class CartCreatedEvent extends BaseEvent {

    @Autowired
    CartCreatedEventHandler handler;

    public CartCreatedEvent(AutowireCapableBeanFactory beanFactory) {
        super(beanFactory, null, BaseEventType.CRUD);
    }

    @Override
    protected CartCreatedEventHandler getHandler() {
        return this.handler;
    }

}
