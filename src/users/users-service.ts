import { Db } from "mongodb";
import { DataContext } from "../data/data-context";
import { User, UserGetDto, UserLoginDto, UserSignUpDto } from "./users";
import { Env, Table } from "../env";
import { Error, ErrorResponse, SuccessResponse } from "../common/response";
import { createHash } from "crypto";
import { Response, Request } from "express";

const emailRegex = new RegExp(".+@.+..+");

export class UsersService {
  private _dataContext: Db;
  private _request: Request;
  private _response: Response;

  constructor(req: Request, res: Response) {
    this._dataContext = DataContext.getInstance();
    this._request = req;
    this._response = res;
  }

  private hashPassword(password: string) {
    return createHash("sha256").update(password).digest("base64");
  }

  public createUser(userDto: UserSignUpDto): UserGetDto {
    /* T2-REF3: user creation */

    const passwordHash = this.hashPassword(userDto.password);

    const user: User = {
      username: userDto.username,
      normalizedUsername: userDto.username.toLocaleUpperCase(),
      email: userDto.email,
      normalizedEmail: userDto.email.toLocaleUpperCase(),
      passwordHash: passwordHash,
    };

    this._dataContext.collection(Table.users).insertOne(user);

    return {
      username: user.username,
      email: user.email,
    };
  }

  public async register(
    userDto: UserSignUpDto
  ): Promise<SuccessResponse<UserGetDto> | ErrorResponse> {
    /* T2-REF1: basic validation */

    const errors = new Array<Error>();

    if (!userDto.username) {
      errors.push({
        message: "Username required",
        property: "username",
      });
    }

    if (!userDto.email) {
      errors.push({
        message: "Email required",
        property: "email",
      });
    }

    if (!emailRegex.exec(userDto.email)) {
      errors.push({
        message: "Invalid email",
        property: "email",
      });
    }

    if (!userDto.password) {
      errors.push({
        message: "Password required",
        property: "password",
      });
    }

    if (errors.length > 0) {
      return { errors, hasErrors: true };
    }

    if (userDto.password !== userDto.passwordConfirm) {
      errors.push({ message: "Passwords do not match", property: "password" });
      return { errors, hasErrors: true };
    }

    /* T2-REF2: duplicate validation */

    const userByUsername = await this._dataContext
      .collection<User>(Table.users)
      .findOne({ normalizedUsername: userDto.username.toLocaleUpperCase() });

    const userByEmail = await this._dataContext
      .collection<User>(Table.users)
      .findOne({ normalizedEmail: userDto.email.toLocaleUpperCase() });

    if (userByUsername) {
      errors.push({
        message: "Username taken.",
        property: "username",
      });
    }

    if (userByEmail) {
      errors.push({
        message: "Email taken.",
        property: "email",
      });
    }

    if (errors.length > 0) {
      this._response.clearCookie(Env.cookieName);
      return { errors, hasErrors: true };
    }

    const user = this.createUser(userDto);

    return {
      data: user,
      hasErrors: false,
    };
  }

  public async login(
    dto: UserLoginDto
  ): Promise<SuccessResponse<UserGetDto> | ErrorResponse> {
    /* T3.1-REF1: basic validation */

    const errors = new Array<Error>();

    if (this.getUser()) {
      errors.push({
        message: "User already logged in",
        property: "",
      });

      return { errors, hasErrors: true };
    }

    if (!dto.username) {
      errors.push({
        message: "Username required",
        property: "username",
      });
    }

    if (!dto.password) {
      errors.push({
        message: "Password required",
        property: "password",
      });
    }

    if (errors.length > 0) {
      return { errors, hasErrors: true };
    }

    const passwordHash = this.hashPassword(dto.password);

    /* T3.1-REF2: user and password validation */

    const user = await this._dataContext
      .collection<User>(Table.users)
      .findOne({ normalizedUsername: dto.username.toLocaleUpperCase() });

    if (!user || user.passwordHash !== passwordHash) {
      errors.push({
        message: "Username or password is incorrect",
        property: "",
      });

      return { errors, hasErrors: true };
    }

    return { data: user, hasErrors: false };
  }

  public getUser() {
    if (!this._request.cookies[Env.cookieName]) {
      return undefined;
    }

    return this._request.cookies[Env.cookieName] as UserGetDto;
  }
}
