import { UserGetDto } from "../users/users";

type UserCookie = UserGetDto & {
  expiration: Date;
};
