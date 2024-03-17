package com.feyz.checkoutcase.app;

// import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.cart.CartAggragate;
import com.feyz.checkoutcase.app.commands.AddItemCommand;
import com.feyz.checkoutcase.app.commands.payloads.AddItemPayload;
import com.feyz.checkoutcase.app.message.ErrorMessage;
import com.feyz.checkoutcase.app.services.Rules;
import com.feyz.checkoutcase.app.util.Setup;
import com.feyz.checkoutcase.app.util.TestUtil;

import static org.assertj.core.api.Assertions.assertThat;

class AddItemTests {
    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;
    private TestUtil testUtil;

    Rules rules;

    @BeforeEach
    public void setup() {
        var setup = Setup.init();
        autowireCapableBeanFactory = setup.autowireCapableBeanFactory;
        testUtil = setup.testUtil;
        rules = setup.rules;
    }

    @Test
    void it_should_add_item_to_cart_from_command() {
        assertThat(autowireCapableBeanFactory).isNotNull();
        var cart = new CartAggragate(autowireCapableBeanFactory);
        assertThat(cart.getChanges()).size().isEqualTo(1);
        assertThat(cart.getTotalQuantity()).isEqualTo(0);

        cart.addItem(new AddItemCommand(new AddItemPayload(1, 2, 3, 10, 1)));
        assertThat(cart.getChanges()).size().isEqualTo(2);
        assertThat(cart.getTotalQuantity()).isEqualTo(1);
    }

    @Test
    void it_should_create_AddItemCommand() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
        cart.addItem(1, 2, 3, 10, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(1);

        cart.addItem(1, 2, 3, 10, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(2);
    }

    @Test
    void it_should_increase_total_quantity_but_not_unique_item_count_when_same_item_added() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
        // Add item A
        cart.addItem(1, 2, 3, 10, 1);

        assertThat(cart.getTotalIdCount()).isEqualTo(1);
        assertThat(cart.getTotalQuantity()).isEqualTo(1);

        // Add item A with 2 quantity
        cart.addItem(1, 2, 3, 10, 2);

        assertThat(cart.getTotalIdCount()).isEqualTo(1);

        cart.addItem(100, 200, 300, 50, 1);

        assertThat(cart.getTotalIdCount()).isEqualTo(2);
        assertThat(cart.getTotalQuantity()).isEqualTo(4);
    }

    @Test
    void it_should_not_add_vas_item_as_default_item_to_cart() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        var categoryId = this.rules.getVasItemCategoryId();
        var sellerId = this.rules.getVasItemSellerId();
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
        var commandResult = cart.addItem(10, categoryId, sellerId, 1, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
        assertThat(commandResult.isResult()).isFalse();
        assertThat(commandResult.getErrorMessage()).isEqualTo(ErrorMessage.NOT_A_VAS_ITEM);
    }

    @Test
    void it_should_add_over_5_digital_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addDigitalItem(cart, 10, 30, 5);
        assertThat(cart.getTotalQuantity()).isEqualTo(5);
        // Add one more item
        var addRes = testUtil.addDigitalItem(cart, 10, 30, 1);
        assertThat(addRes.isSuccess()).isFalse();
        assertThat(cart.getTotalQuantity()).isEqualTo(5);
    }

    @Test
    void it_should_not_add_over_5_digital_item_WHEN_add_2_quantity_at_once() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addDigitalItem(cart, 10, 30, 2);
        assertThat(cart.getTotalQuantity()).isEqualTo(2);

        testUtil.addDigitalItem(cart, 10, 30, 2);
        assertThat(cart.getTotalQuantity()).isEqualTo(4);
        // Add one more item
        var addRes = testUtil.addDigitalItem(cart, 10, 30, 2);
        assertThat(addRes.isSuccess()).isFalse();
        assertThat(cart.getTotalQuantity()).isEqualTo(4);
    }

    @Test
    void it_should_not_add_over_5_digital_item_WHEN_items_are_unique() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addDigitalItem(cart, 101, 30, 1);
        testUtil.addDigitalItem(cart, 102, 30, 1);

        testUtil.addDigitalItem(cart, 103, 30, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(3);
        testUtil.addDigitalItem(cart, 104, 30, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(4);

        // Add 2 items with different ID
        var add2ResDifferentID = testUtil.addDigitalItem(cart, 9999, 30, 2);
        assertThat(add2ResDifferentID.isSuccess()).isFalse();
        assertThat(cart.getTotalQuantity()).isEqualTo(4);

        // Add 2 items with existingID
        var add2ResExistingID = testUtil.addDigitalItem(cart, 101, 30, 2);
        assertThat(add2ResExistingID.isSuccess()).isFalse();
        assertThat(add2ResExistingID.getErrorMessage()).isEqualTo(ErrorMessage.MAX_DIGITAL_ITEM_EXCEED_ERROR);
        assertThat(cart.getTotalQuantity()).isEqualTo(4);
    }

    @Test
    void it_should_not_add_over_10_unique_items() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        assertThat(cart.getTotalIdCount()).isZero();
        testUtil.addDigitalItem(cart, 101, 30, 1);
        testUtil.addDigitalItem(cart, 102, 30, 1);
        testUtil.addDigitalItem(cart, 103, 30, 1);
        testUtil.addDigitalItem(cart, 104, 30, 1);
        assertThat(cart.getTotalIdCount()).isEqualTo(4);
        testUtil.addDigitalItem(cart, 105, 30, 1);
        assertThat(cart.getTotalIdCount()).isEqualTo(5);

        testUtil.addDefaultItem(cart, 201, 30, 1);
        assertThat(cart.getTotalIdCount()).isEqualTo(6);

        testUtil.addDefaultItem(cart, 202, 30, 2);
        assertThat(cart.getTotalIdCount()).isEqualTo(7);

        testUtil.addDefaultItem(cart, 203, 30, 1);
        assertThat(cart.getTotalIdCount()).isEqualTo(8);

        testUtil.addDefaultItem(cart, 204, 30, 2);
        assertThat(cart.getTotalIdCount()).isEqualTo(9);

        testUtil.addDefaultItem(cart, 205, 30, 1);
        assertThat(cart.getTotalIdCount()).isEqualTo(10);

        var addRes11 = testUtil.addDefaultItem(cart, 206, 30, 1);
        assertThat(addRes11.isSuccess()).isFalse();
        assertThat(addRes11.getErrorMessage()).isEqualTo(ErrorMessage.MAX_UNIQUE_ITEM_EXCEED_ITEM_ERROR);
        assertThat(cart.getTotalIdCount()).isEqualTo(10);
    }

    @Test
    void quantity_should_not_be_above_over_10_for_same_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addDefaultItem(cart, 10, 10, 9);
        assertThat(cart.getTotalQuantity()).isEqualTo(9);

        var addRes = testUtil.addDefaultItem(cart, 10, 10, 2);
        assertThat(addRes.isSuccess()).isFalse();
        assertThat(addRes.getErrorMessage()).isEqualTo(ErrorMessage.MAX_QUANTITY_VALUE_EXCEEDED_FOR_THE_ACTUAL_ITEM);
        assertThat(cart.getTotalQuantity()).isEqualTo(9);
    }

    @Test
    void it_should_not_add_item_if_quantity_over_30() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        var addRes1 = testUtil.addDefaultItem(cart, 10, 10, 10);
        assertThat(addRes1.isSuccess()).isTrue();
        assertThat(cart.getTotalQuantity()).isEqualTo(10);

        var addRes2 = testUtil.addDefaultItem(cart, 20, 10, 10);
        assertThat(cart.getTotalQuantity()).isEqualTo(20);
        assertThat(addRes2.isSuccess()).isTrue();

        var addRes3 = testUtil.addDefaultItem(cart, 25, 10, 5);
        assertThat(cart.getTotalQuantity()).isEqualTo(25);
        assertThat(addRes3.isSuccess()).isTrue();

        var addRes4 = testUtil.addDefaultItem(cart, 30, 10, 5);
        assertThat(cart.getTotalQuantity()).isEqualTo(30);
        assertThat(addRes4.isSuccess()).isTrue();

        var addResLast = testUtil.addDefaultItem(cart, 999, 10, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(30);
        assertThat(addResLast.isSuccess()).isFalse();
    }

    @Test
    void it_should_not_add_new_item_if_amount_above_500K() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addDefaultItem(cart, 11, 11, 11, 100000, 1);
        testUtil.addDefaultItem(cart, 12, 12, 12, 100000, 1);
        testUtil.addDefaultItem(cart, 13, 13, 13, 100000, 1);
        testUtil.addDefaultItem(cart, 14, 14, 14, 100000, 1);
        testUtil.addDefaultItem(cart, 15, 15, 15, 100000, 1);
        assertThat(cart.getAmount()).isEqualTo(500_000);
        assertThat(cart.getDiscountAppliedAmount()).isEqualTo(498_000);

        var addRes2KItem = testUtil.addDefaultItem(cart, 1016, 1016, 116, 2000, 1);

        assertThat(addRes2KItem.isSuccess()).isTrue();
        assertThat(cart.getAmount()).isEqualTo(502_000);
        assertThat(cart.getDiscountAppliedAmount()).isEqualTo(500_000);

        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(2000);

        var addRes = testUtil.addDefaultItem(cart, 101, 101, 101, 0.0001, 1);
        assertThat(addRes.isSuccess()).isFalse();
        assertThat(addRes.getErrorMessage()).isEqualTo(ErrorMessage.MAX_AMOUNT_EXCEEDED_IN_CART);

        assertThat(cart.getAmount()).isEqualTo(502_000);
        assertThat(cart.getDiscountAppliedAmount()).isEqualTo(500_000);

    }

}
