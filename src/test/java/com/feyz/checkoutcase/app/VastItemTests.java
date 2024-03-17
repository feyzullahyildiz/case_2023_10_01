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

public class VastItemTests {

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
    void it_should_NOT_add_vas_item_if_parent_not_found() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        assertThat(cart.getTotalQuantity()).isEqualTo(0);
        var res = testUtil.addVasItem(cart, 10, 20, 20, 10);
        assertThat(res.isSuccess()).isFalse();
        assertThat(res.getErrorMessage()).isEqualTo(ErrorMessage.DEFAULT_ITEM_NOT_FOUND_FOR_VAS_ITEM);
    }

    @Test
    void it_should_NOT_add_vas_item_if_parent_is_not_vas_addable() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addDefaultItem(cart, 150, 150, 1);
        assertThat(cart.getItems()).hasSize(1);

        var res = testUtil.addVasItem(cart, 150, 20, 20, 10);
        assertThat(res.isSuccess()).isFalse();
        assertThat(res.getErrorMessage()).isEqualTo(ErrorMessage.DEFAULT_ITEM_DISABLED_FOR_VAS_ITEM);
    }

    @Test
    void it_should_NOT_add_vas_item_if_parent_price_is_lower_than_vas_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 150, 150, 1);
        assertThat(cart.getItems()).hasSize(1);

        var res = testUtil.addVasItem(cart, 150, 20, 151, 10);
        assertThat(res.isSuccess()).isFalse();
        assertThat(res.getErrorMessage()).isEqualTo(ErrorMessage.DEFAULT_ITEM_CANT_BE_LOWER_THAN_VAS_ITEM_PRICE);
    }

    @Test
    void it_should_add_valid_vas_item_to_vas_enabled_default_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 10, 100, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(1);
        var addVasRes = testUtil.addVasItem(cart, 10, 9010, 30, 2);
        assertThat(addVasRes.isSuccess()).isTrue();
        assertThat(cart.getTotalQuantity()).isEqualTo(3);
    }

    @Test
    void it_should_NOT_add_invalid_vas_item_to_default_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 10, 100, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(1);

        var categoryId = rules.getVasItemCategoryId();
        var sellerId = rules.getVasItemSellerId();
        var try1 = cart.addVasItemToItem(10, 301, categoryId, 100, 30, 1);
        var try2 = cart.addVasItemToItem(10, 302, 100, sellerId, 30, 1);
        var try3 = cart.addVasItemToItem(10, 303, 500, 333, 30, 1);

        assertThat(try1.isSuccess()).isFalse();
        assertThat(try1.getErrorMessage()).isEqualTo(ErrorMessage.NOT_A_VAS_ITEM);
        assertThat(try2.isSuccess()).isFalse();
        assertThat(try2.getErrorMessage()).isEqualTo(ErrorMessage.NOT_A_VAS_ITEM);
        assertThat(try3.isSuccess()).isFalse();
        assertThat(try3.getErrorMessage()).isEqualTo(ErrorMessage.NOT_A_VAS_ITEM);
    }

    @Test
    void it_should_add_vas_item_even_10_unique_item_is_already_in_the_cart() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 1001, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1002, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1003, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1004, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1005, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1006, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1007, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1008, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1009, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1010, 100, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(10);
        var resAddFor11 = testUtil.addVasFiendlyDefaultItem(cart, 1011, 100, 1);
        assertThat(resAddFor11.isSuccess()).isFalse();
        assertThat(resAddFor11.getErrorMessage()).isEqualTo(ErrorMessage.MAX_UNIQUE_ITEM_EXCEED_ITEM_ERROR);
        assertThat(cart.getTotalQuantity()).isEqualTo(10);

        var vasItemAdd = testUtil.addVasItem(cart, 1001, 50, 90, 2);
        assertThat(vasItemAdd.isSuccess()).isTrue();
        assertThat(cart.getTotalQuantity()).isEqualTo(12);

    }

    @Test
    void it_should_NOT_add_over_3_vas_item_into_default_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 1001, 100, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(1);

        var vasItemAddRes1 = testUtil.addVasItem(cart, 1001, 51, 90, 1);
        var vasItemAddRes2 = testUtil.addVasItem(cart, 1001, 52, 80, 1);
        var vasItemAddRes3 = testUtil.addVasItem(cart, 1001, 53, 70, 1);
        var vasItemAddRes4 = testUtil.addVasItem(cart, 1001, 54, 60, 1);
        assertThat(vasItemAddRes1.isSuccess()).isTrue();
        assertThat(vasItemAddRes2.isSuccess()).isTrue();
        assertThat(vasItemAddRes3.isSuccess()).isTrue();
        assertThat(vasItemAddRes4.isSuccess()).isFalse();
        assertThat(vasItemAddRes4.getErrorMessage()).isEqualTo(ErrorMessage.DEFAULT_ITEM_MOSTLY_HAVE_3_VAS_ITEM);
    }

    @Test
    void it_should_NOT_add_over_3_same_vas_item_into_default_item() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 1001, 100, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(1);

        var vasItemAddRes1 = testUtil.addVasItem(cart, 1001, 50, 90, 2);
        assertThat(cart.getTotalQuantity()).isEqualTo(3);
        var vasItemAddRes2 = testUtil.addVasItem(cart, 1001, 50, 90, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(4);
        var vasItemAddRes3 = testUtil.addVasItem(cart, 1001, 50, 90, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(4);
        assertThat(vasItemAddRes1.isSuccess()).isTrue();
        assertThat(vasItemAddRes2.isSuccess()).isTrue();
        assertThat(vasItemAddRes3.isSuccess()).isFalse();
    }

    @Test
    void it_should_NOT_add_vas_item_if_total_vas_item_quantity_over_than_10() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 1001, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1002, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1003, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1004, 100, 1);
        testUtil.addVasFiendlyDefaultItem(cart, 1005, 100, 1);

        assertThat(cart.getTotalQuantity()).isEqualTo(5);
        testUtil.addVasItem(cart, 1001, 51, 90, 2);
        testUtil.addVasItem(cart, 1002, 52, 90, 2);
        testUtil.addVasItem(cart, 1003, 53, 90, 2);
        testUtil.addVasItem(cart, 1004, 54, 90, 2);
        testUtil.addVasItem(cart, 1005, 55, 90, 2);
        assertThat(cart.getTotalQuantity()).isEqualTo(15);

        var resAdd11 = testUtil.addVasItem(cart, 1001, 88, 90, 1);
        assertThat(resAdd11.isSuccess()).isFalse();
        assertThat(resAdd11.getErrorMessage()).isEqualTo(ErrorMessage.MAX_VAS_ITEM_QUANTITY_VALUE_EXCEEDED_IN_CART);
        assertThat(cart.getTotalQuantity()).isEqualTo(15);

    }

    @Test
    void it_should_NOT_add_vas_item_if_total_quantity_is_over_than_30() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 1001, 100, 6);
        testUtil.addVasFiendlyDefaultItem(cart, 1002, 100, 6);
        testUtil.addVasFiendlyDefaultItem(cart, 1003, 100, 6);
        testUtil.addVasFiendlyDefaultItem(cart, 1004, 100, 6);
        testUtil.addVasFiendlyDefaultItem(cart, 1005, 100, 6);

        assertThat(cart.getTotalQuantity()).isEqualTo(30);

        var resAddVasItem = testUtil.addVasItem(cart, 1001, 88, 90, 1);
        assertThat(resAddVasItem.isSuccess()).isFalse();
        assertThat(resAddVasItem.getErrorMessage()).isEqualTo(ErrorMessage.MAX_QUANTITY_VALUE_EXCEEDED_IN_CART);
        assertThat(cart.getTotalQuantity()).isEqualTo(30);
    }

    @Test
    void it_should_increase_amount_after_vas_item_added() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addVasFiendlyDefaultItem(cart, 1001, 100, 1);

        assertThat(cart.getAmount()).isEqualTo(100);

        var resAddVasItem = testUtil.addVasItem(cart, 1001, 88, 90, 1);
        assertThat(resAddVasItem.isSuccess()).isTrue();
        assertThat(cart.getTotalQuantity()).isEqualTo(2);
        assertThat(cart.getAmount()).isEqualTo(190);
    }

    @Test
    void it_should_NOT_item_if_total_amount_exceeds_500K() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        
        testUtil.addVasFiendlyDefaultItem(cart, 10, 500_000, 1);
        assertThat(cart.getTotalQuantity()).isEqualTo(1);
        assertThat(cart.getDiscountAppliedAmount()).isEqualTo(498_000);
        testUtil.addVasItem(cart, 10, 99, 1000, 1);
        assertThat(cart.getDiscountAppliedAmount()).isEqualTo(499_000);
        testUtil.addVasItem(cart, 10, 99, 1000, 1);
        assertThat(cart.getDiscountAppliedAmount()).isEqualTo(500_000);
        assertThat(cart.getTotalQuantity()).isEqualTo(3);

        var thirdVasItem = testUtil.addVasItem(cart, 10, 555, 0.001, 1);

        assertThat(thirdVasItem.isSuccess()).isFalse();
        assertThat(thirdVasItem.getErrorMessage()).isEqualTo(ErrorMessage.MAX_AMOUNT_EXCEEDED_IN_CART);

        var promotionId = cart.displayCart().getPayload().getAppliedPromotionId();
        assertThat(promotionId).isEqualTo(this.rules.promotions.totalPricePromotion.getID());

    }


}
