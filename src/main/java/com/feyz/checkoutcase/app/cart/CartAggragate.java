package com.feyz.checkoutcase.app.cart;

import java.util.ArrayList;

import com.feyz.checkoutcase.app.commands.payloads.AddItemPayload;
import com.feyz.checkoutcase.app.commands.payloads.AddVasItemToItemPayload;
import com.feyz.checkoutcase.app.commands.payloads.RemoveItemPayload;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.command_results.AddItemCommandResult;
import com.feyz.checkoutcase.app.command_results.AddVasItemToItemCommandResult;
import com.feyz.checkoutcase.app.command_results.DisplayCartCommandResult;
import com.feyz.checkoutcase.app.command_results.RemoveItemCommandResult;
import com.feyz.checkoutcase.app.command_results.ResetCartCommandResult;
import com.feyz.checkoutcase.app.commands.AddItemCommand;
import com.feyz.checkoutcase.app.commands.AddVasItemToItemCommand;
import com.feyz.checkoutcase.app.commands.DisplayCartCommand;
import com.feyz.checkoutcase.app.commands.RemoveItemCommand;
import com.feyz.checkoutcase.app.commands.ResetCartCommand;
import com.feyz.checkoutcase.app.entity.CartItemEntity;
import com.feyz.checkoutcase.app.events.AddItemEvent;
import com.feyz.checkoutcase.app.events.AddVasItemToItemEvent;
import com.feyz.checkoutcase.app.events.BaseEvent;
import com.feyz.checkoutcase.app.events.CartCreatedEvent;
import com.feyz.checkoutcase.app.events.DisplayCartEvent;
import com.feyz.checkoutcase.app.events.RemoveItemEvent;
import com.feyz.checkoutcase.app.events.ResetCartEvent;
import com.feyz.checkoutcase.app.repository.CartRepository;

public class CartAggragate extends AggragateRoot {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AutowireCapableBeanFactory beanFactory;

    public CartAggragate(AutowireCapableBeanFactory beanFactory) {
        super();
        beanFactory.autowireBean(this);
        // COMMIT CART CREATED EVENT
        this.commitEvent(new CartCreatedEvent(beanFactory));
    }

    public CartAggragate(AutowireCapableBeanFactory beanFactory, ArrayList<BaseEvent<?, ?, ?>> events) {
        super(events);
        beanFactory.autowireBean(this);
    }

    public AddItemCommandResult addItem(AddItemCommand command) {
        var event = new AddItemEvent(beanFactory, command);
        return this.tryAndCommitEvent(event);
    }

    public AddItemCommandResult addItem(int itemId, int categoryId, int sellerId, double price, int quantity) {
        var command = new AddItemCommand(new AddItemPayload(itemId, categoryId, sellerId, price, quantity));
        var event = new AddItemEvent(beanFactory, command);
        return this.tryAndCommitEvent(event);
    }

    public AddVasItemToItemCommandResult addVasItemToItem(AddVasItemToItemCommand command) {
        var event = new AddVasItemToItemEvent(beanFactory, command);
        return this.tryAndCommitEvent(event);
    }

    public AddVasItemToItemCommandResult addVasItemToItem(int itemId,
            int vasItemId,
            int vasCategoryId,
            int vasSellerId,
            double price,
            int quantity) {
        var payload = new AddVasItemToItemPayload(itemId, vasItemId, vasCategoryId, vasSellerId, price, quantity);
        var command = new AddVasItemToItemCommand(payload);
        var event = new AddVasItemToItemEvent(beanFactory, command);
        return this.tryAndCommitEvent(event);
    }

    public ResetCartCommandResult resetCart(ResetCartCommand command) {
        var event = new ResetCartEvent(beanFactory, command);
        return this.tryAndCommitEvent(event);
    }

    public ResetCartCommandResult resetCart() {
        var event = new ResetCartEvent(beanFactory, new ResetCartCommand());
        return this.tryAndCommitEvent(event);
    }

    public RemoveItemCommandResult removeItem(RemoveItemCommand command) {
        var event = new RemoveItemEvent(beanFactory, command);
        return this.tryAndCommitEvent(event);
    }

    public RemoveItemCommandResult removeItem(int itemId) {
        var command = new RemoveItemCommand(new RemoveItemPayload(itemId));
        var event = new RemoveItemEvent(beanFactory, command);
        return this.tryAndCommitEvent(event);
    }

    public DisplayCartCommandResult displayCart(DisplayCartCommand command) {
        var event = new DisplayCartEvent(beanFactory, command);
        return this.tryAndCommitEvent(event);
    }

    public DisplayCartCommandResult displayCart() {
        var event = new DisplayCartEvent(beanFactory, new DisplayCartCommand());
        return this.tryAndCommitEvent(event);
    }

    public int getTotalQuantity() {
        return this.cartRepository.getTotalQuantity(this.getUUID());
    }

    public int getTotalIdCount() {
        return this.cartRepository.getTotalIdCount(this.getUUID());
    }

    public double getAmount() {
        return this.cartRepository.getAmount(this.getUUID());
    }

    public double getDiscountAppliedAmount() {
        return this.cartRepository.getDiscountAppliedAmount(this.getUUID());
    }

    public ArrayList<CartItemEntity> getItems() {
        return this.cartRepository.getItems(this.getUUID());
    }
}
