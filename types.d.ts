declare interface IUser {
  _id?: T;
  email: string;
  password: string;
  username: string;
  role: Role;
  lists: IList[]; //HAS MANY LISTS OF MOVIES
  comparePassword: (password: string) => Promise<boolean>;
  /** Populates document references. */
  populate<Paths = {}>(
    path: string | PopulateOptions | (string | PopulateOptions)[]
  ): Promise<this & Paths>;
  populate<Paths = {}>(
    path: string | PopulateOptions | (string | PopulateOptions)[],
    callback: Callback<this & Paths>
  ): void;
  populate<Paths = {}>(path: string, names: string): Promise<this & Paths>;
  populate<Paths = {}>(
    path: string,
    names: string,
    callback: Callback<this & Paths>
  ): void;
  /** Saves this document by inserting a new document into the database if [document.isNew](/docs/api.html#document_Document-isNew) is `true`, or sends an [updateOne](/docs/api.html#document_Document-updateOne) operation with just the modified paths if `isNew` is `false`. */
  save(options?: SaveOptions): Promise<this>;
  save(options?: SaveOptions, fn?: Callback<this>): void;
  save(fn?: Callback<this>): void;
}

declare namespace Express {
  export interface Request {
    user: IUser;
  }
}
