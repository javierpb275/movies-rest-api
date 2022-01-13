declare interface IUser {
  _id?: T;
  email: string;
  password: string;
  username: string;
  role: Role;
  lists: IList[]; //HAS MANY LISTS OF MOVIES
  comparePassword: (password: string) => Promise<boolean>;
}

declare namespace Express {
  export interface Request {
    user: IUser;
  }
}
