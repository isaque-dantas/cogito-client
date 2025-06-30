export interface UserForm {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

export interface User {
  name: string;
  cpf: string;
  email: string;
}

export enum UserRoles {
  student = "STUDENT",
  coordinator = "COORDINATOR"
}
