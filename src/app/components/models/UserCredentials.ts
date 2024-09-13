import { publishFacade } from "@angular/compiler";

export class User {
    constructor(
      public username: string,
      public email: string,
      public password: string,
      public role:string,
    ) {}
  }
  