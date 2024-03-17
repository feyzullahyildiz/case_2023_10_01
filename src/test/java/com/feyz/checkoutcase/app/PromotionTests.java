package com.feyz.checkoutcase.app;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.cart.CartAggragate;
import com.feyz.checkoutcase.app.services.Rules;
import com.feyz.checkoutcase.app.util.Setup;
import com.feyz.checkoutcase.app.util.TestUtil;

public class PromotionTests {

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;
    private TestUtil testUtil;
    private Rules rules;

    @BeforeEach
    public void setup() {
        var setup = Setup.init();
        autowireCapableBeanFactory = setup.autowireCapableBeanFactory;
        testUtil = setup.testUtil;
        rules = setup.rules;
    }

    @Test
    void it_should_not_have_promotion_at_first() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        var res = cart.displayCart();
        var payload = res.getPayload();
        var promotionId = payload.getAppliedPromotionId();
        var discount = payload.getTotalDiscount();
        assertThat(discount).isEqualTo(0.0);
        assertThat(promotionId).isNull();
    }

    @Test
    void it_should_have_total_promotion() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addDefaultItem(cart, 10, 500, 1);
        var payload = cart.displayCart().getPayload();
        var promotionId = payload.getAppliedPromotionId();
        var discount = payload.getTotalDiscount();
        assertThat(discount).isEqualTo(250);
        assertThat(promotionId).isEqualTo(1232);
        testUtil.addDefaultItem(cart, 11, 4500, 1);
    }

    @Test
    void it_should_change_promotion_to_same_seller_promotion() {
        var cart = new CartAggragate(autowireCapableBeanFactory);

        cart.addItem(100, 333, 99, 500, 1);

        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(1232);
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(250);
        cart.addItem(101, 444, 99, 4500, 1);
        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(9909);
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(500);
    }

    @Test
    void it_should_remove_total_promotion_after_item_removed() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        testUtil.addDefaultItem(cart, 10, 350, 1);
        testUtil.addDefaultItem(cart, 20, 155, 1);
        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(1232);
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(250);
        cart.removeItem(20);
        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(null);
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(0);

    }

    @Test
    void it_should_add_category_promotion() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        var categoryEnabledPromotion = 3003;
        cart.addItem(100, categoryEnabledPromotion, 99, 100, 1);

        assertThat(cart.displayCart().getPayload().getAppliedPromotionId())
                .isEqualTo(rules.promotions.categoryPromotion.getID());
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(5);
    }

    @Test
    void it_should_add_category_promotion_then_it_should_update_to_same_seller_then_it_should_be_total_promotoion() {
        var cart = new CartAggragate(autowireCapableBeanFactory);
        // CATEGORY enabled categoryId
        var categoryId = 3003;
        var categoryPromotion = this.rules.promotions.categoryPromotion;
        var sameSellerPromotion = this.rules.promotions.sameSellerPromotion;
        var totalPricePromotion = this.rules.promotions.totalPricePromotion;

        cart.addItem(100, categoryId, 99, 100, 1);
        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(categoryPromotion.getID());
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(5);
        // Amount 100

        cart.addItem(101, categoryId, 99, 100, 1);
        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(sameSellerPromotion.getID());
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(20);
        // Amount 200

        cart.addItem(102, categoryId, 99, 300, 1);
        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(totalPricePromotion.getID());
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(250);
        // Amount 500

        cart.removeItem(102);
        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(sameSellerPromotion.getID());
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(20);

    }

    @Test
    void it_should_add_item_if_total_amount_exceeds_500000_but_doesnt_exceeds_after_promotion_applied() {
        var totalPricePromotion = this.rules.promotions.totalPricePromotion;
        var cart = new CartAggragate(autowireCapableBeanFactory);

        cart.addItem(10, 4, 99, 250_000, 2);
        assertThat(cart.getAmount()).isEqualTo(500_000);
        assertThat(cart.displayCart().getPayload().getAppliedPromotionId()).isEqualTo(totalPricePromotion.getID());
        assertThat(cart.displayCart().getPayload().getTotalDiscount()).isEqualTo(2000);
        cart.addItem(33, 5, 111, 1500, 1);
        assertThat(cart.getAmount()).isEqualTo(501_500);
    }

}
