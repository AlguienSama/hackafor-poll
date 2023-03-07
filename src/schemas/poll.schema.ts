import Joi from "joi";

export interface IPollApiRequest {
  title: string;
  description: string;
  options: { id: string; value: string }[];
  anonymous_poll?: boolean;
  public_poll?: boolean;
  public_result?: boolean;
  user_registred?: boolean;
  duration: number;
}

export const PollApiRequestSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(50).required(),
  description: Joi.string().required(),
  options: Joi.array().min(2).items(
    Joi.object({
      id: Joi.string().required(),
      value: Joi.string().required(),
    })
  ),
  anonymous_poll: Joi.boolean(),
  public_poll: Joi.boolean(),
  public_result: Joi.boolean(),
  user_registred: Joi.boolean(),
  duration: Joi.number().required().min(0),
});
