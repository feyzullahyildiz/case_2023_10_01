/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';
import { InvalidPayloadError } from '../shared/errors';
export const validateAddItemPayload = <T>(obj: T): T => {
  const schema = Joi.object({
    itemId: Joi.number().positive().required().valid(),
    categoryId: Joi.number().positive().required(),
    sellerId: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().positive().required().valid(),
  });
  const result = schema.validate(obj);
  if (result.error) {
    throw new InvalidPayloadError();
  }
  return result.value;
};

export const validateAddVasItemToItemPayload = <T>(obj: T): T => {
  const schema = Joi.object({
    itemId: Joi.number().positive().required(),
    vasItemId: Joi.number().positive().required(),
    vasCategoryId: Joi.number().positive().required(),
    vasSellerId: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
  });
  const result = schema.validate(obj);
  if (result.error) {
    throw new InvalidPayloadError();
  }
  return result.value;
};
export const validateRemoveItem = <T>(obj: T): T => {
  const schema = Joi.object({
    itemId: Joi.number().positive().required(),
  });
  const result = schema.validate(obj);
  if (result.error) {
    throw new InvalidPayloadError();
  }
  return result.value;
};
