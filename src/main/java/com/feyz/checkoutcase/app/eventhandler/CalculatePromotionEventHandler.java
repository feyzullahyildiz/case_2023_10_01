package com.feyz.checkoutcase.app.eventhandler;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.feyz.checkoutcase.app.command_results.BaseCommandResult;
import com.feyz.checkoutcase.app.events.BaseEvent;
import com.feyz.checkoutcase.app.repository.CartRepository;
import com.feyz.checkoutcase.app.services.Rules;

@Component
public class CalculatePromotionEventHandler extends BaseEventHandler {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private Rules rules;

    @Override
    public BaseCommandResult onTry(BaseEvent event, ArrayList actualEvents) {
        // Returing null in onTry, means it is OK for to onCommit
        return null;
    }

    @Override
    public BaseCommandResult onCommit(String uuid, BaseEvent event) {
        var maxDiscount = List
                .of(this.getCategoryPromotion(uuid), this.getSameSellerPromotion(uuid),
                        this.getTotalPricePromotion(uuid))
                .stream()
                .max((p1, p2) -> Double.compare(p1.getDiscount(), p2.getDiscount()))
                .orElse(null);
        if (maxDiscount == null || maxDiscount.discount == 0) {
            this.cartRepository.removePromotion(uuid);
            return null;
        }
        this.cartRepository.applyPromotion(uuid, maxDiscount.getId(), maxDiscount.getDiscount());
        return null;
    }

    private Promotion getCategoryPromotion(String uuid) {
        var categoryPromotion = this.rules.promotions.categoryPromotion;
        var promotionEnabledCategoryId = categoryPromotion.getCategoryId();
        var id = categoryPromotion.getID();
        var totalDiscount = this.cartRepository.getItems(uuid).stream()
                .filter(item -> item.getCategoryId() == promotionEnabledCategoryId)
                .map(item -> categoryPromotion.discountFuntion(item.getAmount()))
                .reduce(0.0, (total, next) -> total + next, Double::sum);
        return new Promotion(id, totalDiscount);
    }

    private Promotion getSameSellerPromotion(String uuid) {
        var sameSellerPromotion = this.rules.promotions.sameSellerPromotion;
        var id = sameSellerPromotion.getID();
        var items = this.cartRepository.getItems(uuid);
        if (items.size() < 2) {
            return new Promotion(id, 0);
        }
        var isSameSellerPromotion = items.stream()
                .map(item -> item.getSellerId())
                .distinct().count();
        if (isSameSellerPromotion != 1) {
            return new Promotion(id, 0);
        }
        var amount = this.cartRepository.getAmount(uuid);
        var discount = sameSellerPromotion.discountFuntion(amount);
        return new Promotion(id, discount);
    }

    private Promotion getTotalPricePromotion(String uuid) {
        var totalPricePromotion = this.rules.promotions.totalPricePromotion;
        var id = totalPricePromotion.getID();
        var amount = this.cartRepository.getAmount(uuid);
        var discount = totalPricePromotion.discountFuntion(amount);
        return new Promotion(id, discount);
    }

    private class Promotion {
        @lombok.Getter
        private int id;
        @lombok.Getter
        private double discount;

        public Promotion(int id, double discount) {
            this.id = id;
            this.discount = discount;
        }
    }
}
