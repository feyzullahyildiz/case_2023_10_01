package com.feyz.checkoutcase.app.eventhandler;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.feyz.checkoutcase.app.command_results.BaseCommandResult;
import com.feyz.checkoutcase.app.events.BaseEvent;
import com.feyz.checkoutcase.app.repository.CartRepository;

@Component
public class CartCreatedEventHandler extends BaseEventHandler {
    @Autowired
    private CartRepository cartRepository;

    @Override
    public BaseCommandResult onTry(BaseEvent event, ArrayList actualEvents) {
        // Returing null in onTry, means it is OK for to onCommit
        return null;
    }

    @Override
    public BaseCommandResult onCommit(String uuid, BaseEvent event) {
        this.cartRepository.initEntity(uuid);
        return null;
    }

}
