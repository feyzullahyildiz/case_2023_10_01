package com.feyz.checkoutcase.app.eventhandler;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Component;

import com.feyz.checkoutcase.app.cart.CartAggragate;
import com.feyz.checkoutcase.app.command_results.RemoveItemCommandResult;
import com.feyz.checkoutcase.app.commands.RemoveItemCommand;
import com.feyz.checkoutcase.app.commands.payloads.RemoveItemPayload;
import com.feyz.checkoutcase.app.errors.ItemNotFoundToRemove;
import com.feyz.checkoutcase.app.events.BaseEvent;
import com.feyz.checkoutcase.app.events.CalculatePromotionEvent;
import com.feyz.checkoutcase.app.message.Message;
import com.feyz.checkoutcase.app.repository.CartRepository;

@Component
public class RemoveItemEventHandler extends
        BaseEventHandler<BaseEvent<RemoveItemCommand, RemoveItemCommandResult, RemoveItemPayload>, RemoveItemCommand, RemoveItemCommandResult, RemoveItemPayload> {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AutowireCapableBeanFactory beanFactory;

    @Override
    public RemoveItemCommandResult onTry(BaseEvent<RemoveItemCommand, RemoveItemCommandResult, RemoveItemPayload> event,
            ArrayList<BaseEvent<?, ?, ?>> actualEvents) {

        try {
            var clonedCart = new CartAggragate(beanFactory, actualEvents);
            var uuid = clonedCart.getUUID();
            var itemExists = this.cartRepository.hasItem(uuid, event.getPayload().getItemId());
            if (!itemExists) {
                throw new ItemNotFoundToRemove();
            }
            clonedCart.commitEvent(event);

            return RemoveItemCommandResult.success(null);
        } catch (Exception e) {
            return RemoveItemCommandResult.failure(e.getMessage());
        }
    }

    @Override
    public RemoveItemCommandResult onCommit(String uuid,
            BaseEvent<RemoveItemCommand, RemoveItemCommandResult, RemoveItemPayload> event) {

        this.cartRepository.removeItem(uuid, event.getPayload().getItemId());

        var calculatePromotionEvent = new CalculatePromotionEvent(this.beanFactory);
        calculatePromotionEvent.commitEvent(uuid);

        return RemoveItemCommandResult.success(Message.ITEM_REMOVED);
    }

}
