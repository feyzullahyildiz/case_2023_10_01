package com.feyz.checkoutcase.app;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.services.Rules;
import com.feyz.checkoutcase.app.util.Setup;

import static org.assertj.core.api.Assertions.assertThat;

public class RuleTests {
    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    Rules rules;

    @BeforeEach
    public void setup() {
        var setup = Setup.init();
        autowireCapableBeanFactory = setup.autowireCapableBeanFactory;
        rules = setup.rules;
    }

    @Test
    void bean_factory_shoul_not_be_null() {
        assertThat(autowireCapableBeanFactory).isNotNull();
    }

    @Test
    void it_should_be_valid_digital_item() {
        var categoryId = 7889;
        var aSellerId = 10;
        assertThat(rules.isValidItem(categoryId, aSellerId)).isTrue();
        assertThat(rules.isDigitalItem(categoryId, aSellerId)).isTrue();
        assertThat(rules.isVasItem(categoryId, aSellerId)).isFalse();
        assertThat(rules.isDefaultItem(categoryId, aSellerId)).isFalse();
    }

    @Test
    void it_should_be_valid_default_item() {
        var categoryId = 100;
        var sellerId = 100;
        assertThat(rules.isValidItem(categoryId, sellerId)).isTrue();
        assertThat(rules.isDefaultItem(categoryId, sellerId)).isTrue();
        assertThat(rules.isDigitalItem(categoryId, sellerId)).isFalse();
        assertThat(rules.isVasItem(categoryId, sellerId)).isFalse();
    }

    @Test
    void it_should_be_valid_vas_item() {
        var categoryId = 3242;
        var sellerId = 5003;
        assertThat(rules.isValidItem(categoryId, sellerId)).isTrue();
        assertThat(rules.isVasItem(categoryId, sellerId)).isTrue();
        assertThat(rules.isDefaultItem(categoryId, sellerId)).isFalse();
        assertThat(rules.isDigitalItem(categoryId, sellerId)).isFalse();
    }
    

    @Test
    void it_should_check_invalid_items() {
        var vasCategoryId = 3242;
        var vasSellerId = 5003;
        var digitalCategoryId = 7889;
        var vasAddableCategoryIdA = 1001;
        var vasAddableCategoryIdB = 3004;

        // vasCategoryId but different SellerId
        assertThat(rules.isValidItem(vasCategoryId, 100)).isFalse();
        assertThat(rules.isVasItem(vasCategoryId, 100)).isFalse();

        // Digital CategoryId and vasSellerId
        assertThat(rules.isValidItem(digitalCategoryId, vasSellerId)).isFalse();
        assertThat(rules.isDefaultItem(digitalCategoryId, vasSellerId)).isFalse();
        assertThat(rules.isDigitalItem(digitalCategoryId, vasSellerId)).isFalse();
        assertThat(rules.isVasItem(digitalCategoryId, vasSellerId)).isFalse();

        // Default item but sellerId should not belongs to VasSellerId
        assertThat(rules.isValidItem(vasAddableCategoryIdA, vasSellerId)).isFalse();
        assertThat(rules.isValidItem(vasAddableCategoryIdB, vasSellerId)).isFalse();
        assertThat(rules.isDefaultItem(vasAddableCategoryIdA, vasSellerId)).isFalse();
        assertThat(rules.isDefaultItem(vasAddableCategoryIdB, vasSellerId)).isFalse();
    }

}
