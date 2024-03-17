package com.feyz.checkoutcase.app.eventhandler;

import com.feyz.checkoutcase.app.command_results.DisplayCartCommandResult;
import com.feyz.checkoutcase.app.command_results.command_message.DisplayCartCommandResultMessage;
import com.feyz.checkoutcase.app.commands.DisplayCartCommand;
import com.feyz.checkoutcase.app.events.BaseEvent;
import com.feyz.checkoutcase.app.repository.CartRepository;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DisplayCartEventHandler
        extends
        BaseEventHandler<BaseEvent<DisplayCartCommand, DisplayCartCommandResult, Object>, DisplayCartCommand, DisplayCartCommandResult, Object> {

    @Autowired
    private CartRepository cartRepository;

    @Override
    public DisplayCartCommandResult onTry(BaseEvent<DisplayCartCommand, DisplayCartCommandResult, Object> event,
            ArrayList<BaseEvent<?, ?, ?>> actualEvents) {
        // Returing null in onTry, means it is OK for to onCommit
        return null;
    }

    @Override
    public DisplayCartCommandResult onCommit(String uuid,
            BaseEvent<DisplayCartCommand, DisplayCartCommandResult, Object> event) {
        var cart = this.cartRepository.get(uuid);
        var appliedPromotionId = cart.getAppliedPromotionId();
        var totalDiscount = cart.getTotalDiscount();
        var totalAmount = cart.getAmount();

        var resultMessage = new DisplayCartCommandResultMessage(cart.getItems(),
                totalAmount,
                appliedPromotionId,
                totalDiscount);
        return new DisplayCartCommandResult(true, resultMessage);
    }

}
