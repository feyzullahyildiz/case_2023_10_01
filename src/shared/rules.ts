export const Rules = {
  ITEM: {
    VAS_ITEM: {
      SELLER_ID: 5003,
      CATEGORY_ID: 3242,
    },
    DEFAULT_ITEM: {
      VAS_ITEM_ALLOWED_CATEGORY_IDS: [1001, 3004],
    },
    DIGITAL_ITEM: {
      CATEGORY_ID: 7889,
    },
    PROMOTION: {
      CATEGORY_PROMOTION: {
        ID: 5676,
        DISCOUNT_PERCENTAGE: 5,
        CATEGORY_ID: 3003,
      },
      SAME_SELLER_PROMOTION: {
        ID: 9909,
        DISCOUNT_PERCENTAGE: 10,
      },
      TOTAL_PRICE_PROMOTION: {
        ID: 1232,
        DISCOUNT_FUN: (value: number) => {
          if (value >= 50_000) {
            return 2_000;
          }
          if (50_000 > value && value >= 10_000) {
            return 1000;
          }
          if (10_000 > value && value >= 5_000) {
            return 500;
          }
          if (5_000 > value && value >= 500) {
            return 250;
          }
          return 0;
        },
      },
    },
  },
  MAX_ALLOWED_AMOUNT_LIMIT_IN_CART: 500_000,
  MAX_ALLOWED_DIGITAL_ITEM_COUNT_IN_CART: 5,
  MAX_ALLOWED_ITEM_COUNT_IN_CART: 30,
  MAX_ALLOWED_UNIQUE_ITEM_COUNT_IN_CART: 10,
  MAX_ALLOWED_QUANTITY_VALUE_FOR_ITEM: 10,

  MAX_ALLOWED_VAS_QUANTITY_IN_DEFAULT_ITEM: 3,
  MAX_ALLOWED_VAS_QUANTITY_IN_CART: 10,
};
