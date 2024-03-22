export type User = {
  username: string;
  normalizedUsername: string;
  email: string;
  normalizedEmail: string;
  passwordHash: string;
};

export type UserLoginDto = {
  username: string;
  password: string;
};

export type UserSignUpDto = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type UserGetDto = {
  username: string;
  email: string;
};
