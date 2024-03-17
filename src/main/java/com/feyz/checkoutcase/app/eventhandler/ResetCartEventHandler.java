package com.feyz.checkoutcase.app.eventhandler;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.feyz.checkoutcase.app.command_results.ResetCartCommandResult;
import com.feyz.checkoutcase.app.commands.ResetCartCommand;
import com.feyz.checkoutcase.app.events.BaseEvent;
import com.feyz.checkoutcase.app.message.Message;
import com.feyz.checkoutcase.app.repository.CartRepository;

@Component
public class ResetCartEventHandler extends
        BaseEventHandler<BaseEvent<ResetCartCommand, ResetCartCommandResult, String>, ResetCartCommand, ResetCartCommandResult, String> {

    @Autowired
    private CartRepository cartRepository;

    @Override
    public ResetCartCommandResult onTry(BaseEvent<ResetCartCommand, ResetCartCommandResult, String> event,
            ArrayList<BaseEvent<?, ?, ?>> actualEvents) {
        try {

            return ResetCartCommandResult.success(null);
        } catch (Exception e) {
            return ResetCartCommandResult.failure(e.getMessage());
        }
    }

    @Override
    public ResetCartCommandResult onCommit(String uuid,
            BaseEvent<ResetCartCommand, ResetCartCommandResult, String> event) {
        this.cartRepository.resetCart(uuid);
        return ResetCartCommandResult.success(Message.CART_RESETTED);
    }

}
