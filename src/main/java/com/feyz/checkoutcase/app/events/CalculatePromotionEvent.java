package com.feyz.checkoutcase.app.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.eventhandler.CalculatePromotionEventHandler;

public class CalculatePromotionEvent extends BaseEvent {

    @Autowired
    private CalculatePromotionEventHandler handler;

    public CalculatePromotionEvent(AutowireCapableBeanFactory beanFactory) {
        super(beanFactory, null, BaseEventType.CRUD);
    }

    @Override
    protected CalculatePromotionEventHandler getHandler() {
        return this.handler;
    }

}
