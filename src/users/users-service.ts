import { Db } from "mongodb";
import { DataContext } from "../data/data-context";
import { User, UserGetDto, UserLoginDto, UserSignUpDto } from "./users";
import { Env, Table } from "../env";
import { Error } from "../common/error";
import { createHash } from "crypto";
import { Response } from "express";

export class UsersService {
  private _dataContext: Db;
  private _response: Response;

  constructor(res: Response) {
    this._dataContext = DataContext.getInstance();
    this._response = res;
  }

  private hashPassword(password: string) {
    return createHash("sha256").update(password).digest("base64");
  }

  public createUser(userDto: UserSignUpDto): UserGetDto {
    const passwordHash = this.hashPassword(userDto.password);

    const user: User = {
      username: userDto.username,
      normalizedUsername: userDto.username.normalize(),
      email: userDto.email,
      normalizedEmail: userDto.email.normalize(),
      passwordHash: passwordHash,
    };

    this._dataContext.collection(Table.users).insertOne(user);

    return {
      username: user.username,
      email: user.email,
    };
  }

  public async signUp(userDto: UserSignUpDto): Promise<void | Error[]> {
    const errors = new Array<Error>();
    const userByUsername = await this._dataContext
      .collection<User>(Table.users)
      .findOne({ normalizedUsername: userDto.username.normalize() });

    const userByEmail = await this._dataContext
      .collection<User>(Table.users)
      .findOne({ normalizedEmail: userDto.email.normalize() });

    if (userByUsername) {
      errors.push({
        property: "username",
        message: "Username taken.",
      });
    }

    if (userByEmail) {
      errors.push({
        property: "email",
        message: "Email taken.",
      });
    }

    if (errors.length > 0) {
      this._response.clearCookie(Env.cookieName);
      return errors;
    }

    const user = this.createUser(userDto);

    const cookieData: UserGetDto = {
      username: user.username,
      email: user.email,
    };

    this._response.cookie(Env.cookieName, cookieData);
  }

  public async signIn(dto: UserLoginDto): Promise<void | Error> {
    const passwordHash = this.hashPassword(dto.password);

    const user = await this._dataContext
      .collection<User>(Table.users)
      .findOne({ normalizedUsername: dto.username.normalize() });

    if (!user) {
      return { message: "Username or password is incorrect", property: "" };
    }

    if (user.passwordHash !== passwordHash) {
      return { message: "Username or password is incorrect", property: "" };
    }
  }
}
