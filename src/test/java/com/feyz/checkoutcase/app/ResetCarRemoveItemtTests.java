package com.feyz.checkoutcase.app;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.cart.CartAggragate;
import com.feyz.checkoutcase.app.message.ErrorMessage;
import com.feyz.checkoutcase.app.services.Rules;
import com.feyz.checkoutcase.app.util.Setup;
import com.feyz.checkoutcase.app.util.TestUtil;

public class ResetCarRemoveItemtTests {

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
    void it_should_reset_cart() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
        testUtil.addDefaultItem(cart, 100, 20, 1);
        testUtil.addDigitalItem(cart, 200, 200, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(2);
        cart.resetCart();
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
    }

    @Test
    void it_should_NOT_remove_item_if_not_exists() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        var removeRes = cart.removeItem(100);
        assertThat(removeRes.isSuccess()).isFalse();
        assertThat(removeRes.getErrorMessage()).isEqualTo(ErrorMessage.ITEM_NOT_FOUND_TO_REMOVE);
    }

    @Test
    void it_should_remove_vas_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 10, 400, 1);
        testUtil.addVasItem(cart, 10, 999, 100, 2);
        assertThat(cart.getTotalQuantity()).isEqualTo(3);
        var removeRes = cart.removeItem(999);
        assertThat(removeRes.isSuccess()).isTrue();
        assertThat(cart.getTotalQuantity()).isEqualTo(1);
    }

    @Test
    void it_should_remove_default_item_with_vas_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 10, 400, 1);
        testUtil.addVasItem(cart, 10, 999, 100, 2);
        assertThat(cart.getTotalQuantity()).isEqualTo(3);
        var removeRes = cart.removeItem(10);
        assertThat(removeRes.isSuccess()).isTrue();
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
    }

    @Test
    void it_should_remove_item_from_cart() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
        testUtil.addDefaultItem(cart, 100, 20, 1);
        var removeRes = cart.removeItem(100);
        assertThat(removeRes.isSuccess()).isTrue();
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
    }

}
