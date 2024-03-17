package com.feyz.checkoutcase.app.eventhandler;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Component;

import com.feyz.checkoutcase.app.cart.CartAggragate;
import com.feyz.checkoutcase.app.command_results.AddVasItemToItemCommandResult;
import com.feyz.checkoutcase.app.commands.AddVasItemToItemCommand;
import com.feyz.checkoutcase.app.commands.payloads.AddVasItemToItemPayload;
import com.feyz.checkoutcase.app.entity.DefaultItemEntity;
import com.feyz.checkoutcase.app.entity.ItemEntityType;
import com.feyz.checkoutcase.app.errors.DefaultItemDisabledForVasItem;
import com.feyz.checkoutcase.app.errors.DefaultItemMostlyHave3VasItem;
import com.feyz.checkoutcase.app.errors.DefaultItemNotFoundForVasItem;
import com.feyz.checkoutcase.app.errors.DefaultItemPriceCanBeLowerThanVasItemPrice;
import com.feyz.checkoutcase.app.errors.InvalidItemError;
import com.feyz.checkoutcase.app.errors.MaxAmountExceedInCartError;
import com.feyz.checkoutcase.app.errors.MaxQuantityExceedForVasItemsInCart;
import com.feyz.checkoutcase.app.errors.MaxQuantityExceedInCartError;
import com.feyz.checkoutcase.app.errors.NotVasItemError;
import com.feyz.checkoutcase.app.events.BaseEvent;
import com.feyz.checkoutcase.app.events.CalculatePromotionEvent;
import com.feyz.checkoutcase.app.message.Message;
import com.feyz.checkoutcase.app.repository.CartRepository;
import com.feyz.checkoutcase.app.services.Rules;

@Component
public class AddVasItemToItemEventHandler extends
        BaseEventHandler<BaseEvent<AddVasItemToItemCommand, AddVasItemToItemCommandResult, AddVasItemToItemPayload>, AddVasItemToItemCommand, AddVasItemToItemCommandResult, AddVasItemToItemPayload> {

    @Autowired
    private Rules rules;
    @Autowired
    private AutowireCapableBeanFactory beanFactory;
    @Autowired
    private CartRepository cartRepository;

    @Override
    public AddVasItemToItemCommandResult onTry(
            BaseEvent<AddVasItemToItemCommand, AddVasItemToItemCommandResult, AddVasItemToItemPayload> event,
            ArrayList<BaseEvent<?, ?, ?>> actualEvents) {
        try {
            var clonedCart = new CartAggragate(beanFactory, actualEvents);
            var uuid = clonedCart.getUUID();
            clonedCart.commitEvent(event);
            var payload = event.getPayload();

            var isValidItem = rules.isValidItem(payload.getVasCategoryId(), payload.getVasSellerId());
            if (!isValidItem) {
                throw new InvalidItemError();
            }
            var isVasItem = rules.isVasItem(payload.getVasCategoryId(), payload.getVasSellerId());
            if (!isVasItem) {
                throw new NotVasItemError();
            }
            var defaultItemId = payload.getItemId();
            var defaultItem = (DefaultItemEntity) this.cartRepository.getDefaultItemById(uuid, defaultItemId);
            if (defaultItem == null) {
                throw new DefaultItemNotFoundForVasItem();
            }
            if (!this.rules.isVasAddable(defaultItem.getCategoryId(), defaultItem.getSellerId())) {
                throw new DefaultItemDisabledForVasItem();
            }
            if (payload.getPrice() > defaultItem.getPrice()) {
                throw new DefaultItemPriceCanBeLowerThanVasItemPrice();
            }
            if (defaultItem.getVasItemTotalQuantity() > this.rules.MAX_ALLOWED_VAS_QUANTITY_IN_A_DEFAULT_ITEM) {
                throw new DefaultItemMostlyHave3VasItem();
            }

            var discountAppliedTotalAmount = clonedCart.getDiscountAppliedAmount();
            if (discountAppliedTotalAmount > rules.MAX_ALLOWED_AMOUNT_LIMIT_IN_CART) {
                throw new MaxAmountExceedInCartError();
            }
            var vasItemTotalQuantity = this.cartRepository.getTotalQuantityByType(uuid, ItemEntityType.VasItem);

            if (vasItemTotalQuantity > this.rules.MAX_ALLOWED_VAS_ITEM_QUANTITY_IN_CART) {
                throw new MaxQuantityExceedForVasItemsInCart();
            }
            var totalQuantity = this.cartRepository.getTotalQuantity(uuid);
            if (totalQuantity > this.rules.MAX_ALLOWED_QUANTITY_IN_CART) {
                throw new MaxQuantityExceedInCartError();
            }

            return AddVasItemToItemCommandResult.success(null);
        } catch (Exception e) {
            return AddVasItemToItemCommandResult.failure(e.getMessage());
        }
    }

    @Override
    public AddVasItemToItemCommandResult onCommit(String uuid,
            BaseEvent<AddVasItemToItemCommand, AddVasItemToItemCommandResult, AddVasItemToItemPayload> event) {
        this.cartRepository.addVasItemToItem(uuid, event.getPayload());

        var calculatePromotionEvent = new CalculatePromotionEvent(this.beanFactory);
        calculatePromotionEvent.commitEvent(uuid);

        return AddVasItemToItemCommandResult.success(Message.VAS_ITEM_ADDED);
    }

}
