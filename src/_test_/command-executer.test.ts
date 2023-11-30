import { Rules } from '../shared/rules';
import { CommandExecuter } from '../app/CommandExecuter';
import { ErrorMessages } from '../shared/message';

describe('Command Executer', () => {
  it('Unknown command', () => {
    const e = new CommandExecuter();
    expect(e.execute({ command: 'foo' })).toMatchObject({
      result: false,
      message: 'Unknown command',
    });
  });
  it('should result false invalid payload', () => {
    const e = new CommandExecuter();
    const command = {
      command: 'addItem',
      payload: {
        itemId: 'ALI_DURU',
        categoryId: 1,
        sellerId: 1,
        price: 1,
        quantity: 1,
      },
    };
    expect(e.execute(command)).toMatchObject({
      result: false,
      message: ErrorMessages.INVALID_PAYLOAD,
    });
  });
  it('addItem and displayCart', () => {
    const e = new CommandExecuter();
    const addItemCommand = {
      command: 'addItem',
      payload: {
        itemId: 1000,
        categoryId: Rules.ITEM.DEFAULT_ITEM.VAS_ITEM_ALLOWED_CATEGORY_IDS[0],
        sellerId: 99,
        price: 100,
        quantity: 2,
      },
    };
    e.execute(addItemCommand);
    expect(e.execute({ command: 'displayCart' })).toMatchObject({
      result: true,
      message: {
        items: [
          {
            itemId: 1000,
            categoryId: Rules.ITEM.DEFAULT_ITEM.VAS_ITEM_ALLOWED_CATEGORY_IDS[0],
            sellerId: 99,
            price: 100,
            quantity: 2,
            vasItems: [],
          },
        ],
        totalAmount: 200,
        totalDiscount: 0,
        appliedPromotionId: null,
      },
    });
    const addSubItemCommand = {
      command: 'addVasItemToItem',
      payload: {
        itemId: 1000,
        vasItemId: 9999,
        vasCategoryId: Rules.ITEM.VAS_ITEM.CATEGORY_ID,
        vasSellerId: Rules.ITEM.VAS_ITEM.SELLER_ID,
        price: 30,
        quantity: 2,
      },
    };
    e.execute(addSubItemCommand);

    expect(e.execute({ command: 'displayCart' })).toMatchObject({
      result: true,
      message: {
        items: [
          {
            itemId: 1000,
            categoryId: Rules.ITEM.DEFAULT_ITEM.VAS_ITEM_ALLOWED_CATEGORY_IDS[0],
            sellerId: 99,
            price: 100,
            quantity: 2,
            vasItems: [
              {
                vasItemId: 9999,
                vasCategoryId: Rules.ITEM.VAS_ITEM.CATEGORY_ID,
                vasSellerId: Rules.ITEM.VAS_ITEM.SELLER_ID,
                price: 30,
                quantity: 2,
              },
            ],
          },
        ],
        totalAmount: 260,
        totalDiscount: 0,
        appliedPromotionId: null,
      },
    });
  });
});
