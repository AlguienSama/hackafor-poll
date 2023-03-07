import Joi from 'joi';

export interface ILogin {
  username?: string;
  email: string;
  password: string;
  repeat_password?: string;
}

export const LoginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(25),
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  repeat_password: Joi.ref('password')
}).with('username', 'repeat_password');
