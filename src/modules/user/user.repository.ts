import { User } from "./user.model";
import { IUser } from "./user.interface";

const createUser = async (payload: IUser) => {
  return await User.create(payload);
};

const findByEmail = async (email: string) => {
  return await User.findOne({
    email,
    deletedAt: null,
  }).select("+password");
};

const findAll = async () => {
  return await User.find({ deletedAt: null });
};

const softDelete = async (id: string) => {
  return await User.findByIdAndUpdate(id, {
    deletedAt: new Date(),
  });
};

export const UserRepository = {
  createUser,
  findByEmail,
  findAll,
  softDelete,
};
