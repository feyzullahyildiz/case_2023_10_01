package com.feyz.checkoutcase.app.eventhandler;

import com.feyz.checkoutcase.app.cart.CartAggragate;
import com.feyz.checkoutcase.app.command_results.AddItemCommandResult;
import com.feyz.checkoutcase.app.commands.AddItemCommand;
import com.feyz.checkoutcase.app.commands.payloads.AddItemPayload;
import com.feyz.checkoutcase.app.entity.ItemEntityType;
import com.feyz.checkoutcase.app.errors.InvalidItemError;
import com.feyz.checkoutcase.app.errors.MaxAmountExceedInCartError;
import com.feyz.checkoutcase.app.errors.MaxQuantityExceedForTheActualItemError;
import com.feyz.checkoutcase.app.errors.MaxQuantityExceedInCartError;
import com.feyz.checkoutcase.app.errors.MaxDigitalItemExceedError;
import com.feyz.checkoutcase.app.errors.MaxUniqueItemExceedError;
import com.feyz.checkoutcase.app.events.BaseEvent;
import com.feyz.checkoutcase.app.events.CalculatePromotionEvent;
import com.feyz.checkoutcase.app.message.Message;
import com.feyz.checkoutcase.app.repository.CartRepository;
import com.feyz.checkoutcase.app.services.Rules;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Component;

@Component
public class AddItemEventHandler
        extends
        BaseEventHandler<BaseEvent<AddItemCommand, AddItemCommandResult, AddItemPayload>, AddItemCommand, AddItemCommandResult, AddItemPayload> {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AutowireCapableBeanFactory beanFactory;
    @Autowired
    Rules rules;

    @Override
    public AddItemCommandResult onTry(BaseEvent<AddItemCommand, AddItemCommandResult, AddItemPayload> event,
            ArrayList<BaseEvent<?, ?, ?>> actualEvents) {
        try {
            var clonedCart = new CartAggragate(beanFactory, actualEvents);
            var uuid = clonedCart.getUUID();
            clonedCart.commitEvent(event);
            var payload = event.getPayload();
            var itemId = payload.getItemId();

            var totalQuantityInCart = clonedCart.getTotalQuantity();

            var discountAppliedTotalAmount = clonedCart.getDiscountAppliedAmount();
            if (discountAppliedTotalAmount > rules.MAX_ALLOWED_AMOUNT_LIMIT_IN_CART) {
                throw new MaxAmountExceedInCartError();
            }
            if (totalQuantityInCart > rules.MAX_ALLOWED_QUANTITY_IN_CART) {
                throw new MaxQuantityExceedInCartError();
            }

            var isValidItem = rules.isValidItem(payload.getCategoryId(), payload.getSellerId());
            if (!isValidItem) {
                throw new InvalidItemError();
            }
            // VasItem is not addable to the Cart directly
            var isVasItem = rules.isVasItem(payload.getCategoryId(), payload.getSellerId());
            if (isVasItem) {
                throw new InvalidItemError();
            }
            var totalIdCount = this.cartRepository.getTotalIdCount(uuid);
            if (totalIdCount > this.rules.MAX_ALLOWED_UNIQUE_ID_COUNT_IN_CART) {
                throw new MaxUniqueItemExceedError();
            }
            var quantityOfActualItem = this.cartRepository.getQuantityOfDefaultOrDigitalItem(uuid, itemId);
            //
            var totalDigitalItemQuantity = this.cartRepository.getTotalQuantityByType(uuid, ItemEntityType.Digital);

            if (totalDigitalItemQuantity > this.rules.MAX_ALLOWED_DIGITAL_ITEM_QUANTITY_IN_CART) {
                throw new MaxDigitalItemExceedError();
            }
            if (quantityOfActualItem > this.rules.MAX_ALLOWED_QUANTITY) {
                throw new MaxQuantityExceedForTheActualItemError();
            }

            return AddItemCommandResult.success(null);

        } catch (Exception e) {
            return AddItemCommandResult.failure(e.getMessage());
        }
    }

    @Override
    public AddItemCommandResult onCommit(String uuid,
            BaseEvent<AddItemCommand, AddItemCommandResult, AddItemPayload> event) {
        this.cartRepository.addItemToCart(uuid, event.getPayload());

        var calculatePromotionEvent = new CalculatePromotionEvent(this.beanFactory);
        calculatePromotionEvent.commitEvent(uuid);

        return AddItemCommandResult.success(Message.ITEM_ADDED);
    }

}
