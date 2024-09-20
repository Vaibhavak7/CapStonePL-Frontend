import { publishFacade } from "@angular/compiler";

export class User {
    constructor(
      public userName: string,
      public email: string,
      public password: string,
      public role:string,
    ) {}
  }
  