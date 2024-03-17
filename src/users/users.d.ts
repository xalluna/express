export type User = {
  username: string;
  normalizedUsername: string;
  email: string;
  normaizledEmail: string;
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
