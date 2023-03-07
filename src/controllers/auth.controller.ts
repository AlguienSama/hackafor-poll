import { Request, Response } from 'express';

import { ILogin, LoginSchema } from '@schemas/user.schema'
import { UserEntity } from '@entities/user.entity';

export const login = async (req: Request, res: Response) => {
  try {
    const value: ILogin = await LoginSchema.validateAsync(req.body);

    let user = value.username ? await _register(value) : await _login(value);

    if (!user) { throw Error('404') }

    await user.generateJWT();

    return res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
}

const _login = async (data: ILogin): Promise<UserEntity | null> => {
  const user = await UserEntity.findOne({
    where: {
      email: data.email
    },
    select: ['user_id', 'email', 'username', 'avatar', 'password', 'role', 'age', 'gender']
  });

  if (!(user && await user.comparePassword(data.password))) {
    throw Error('401')
  }

  return user;
}
const _register = async (data: ILogin): Promise<UserEntity> => {
  const user = new UserEntity();
  user.username = data.username;
  user.email = data.email;
  await user.setPassword(data.password);

  return await user.save();
}
