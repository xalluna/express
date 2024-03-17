import { Db } from "mongodb";
import { DataContext } from "../data/data-context";
import { User, UserSignUpDto } from "./users";
import { Env } from "../env";
import { Error } from "../common/error";
import { createHash } from "crypto";

class UsersService {
  private _dataContext: Db;
  constructor() {
    this._dataContext = DataContext.getInstance();
  }

  public createUser(userDto: UserSignUpDto) {
    const passwordHash = createHash("sha256")
      .update(userDto.password)
      .digest("base64");
  }

  //   private async *validateSignUp(userDto: UserSignUpDto): AsyncGenerator<Error> {
  //     const userByUsername = await this._dataContext
  //       .collection(Env.mongoTables.users)
  //       .findOne<User>({ normalizedUsername: userDto.username.normalize() });

  //     const userByEmail = await this._dataContext
  //       .collection(Env.mongoTables.users)
  //       .findOne<User>({ normalizedEmail: userDto.email.normalize() });

  //     if (userByUsername) {
  //       yield {
  //         property: "username",
  //         message: "Username taken.",
  //       };
  //     }

  //     if (userByEmail) {
  //       yield {
  //         property: "email",
  //         message: "Email taken.",
  //       };
  //     }

  //     return;
  //   }

  public async signUp(userDto: UserSignUpDto): Promise<User | Error | Error[]> {
    const errors = new Array<Error>();
    const userByUsername = await this._dataContext
      .collection(Env.mongoTables.users)
      .findOne<User>({ normalizedUsername: userDto.username.normalize() });

    const userByEmail = await this._dataContext
      .collection(Env.mongoTables.users)
      .findOne<User>({ normalizedEmail: userDto.email.normalize() });

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

    return {} as unknown as User;
  }
}
