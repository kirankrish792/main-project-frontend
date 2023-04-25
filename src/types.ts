
export interface ContractData {
  address: string;
  jsonInterface: JsonInterface[];
}

export interface JsonInterface {
  inputs: Input[];
  name: string;
  outputs: Input[];
  stateMutability: string;
  type: string;
  constant?: boolean;
  signature: string;
}

export interface Input {
  internalType: string;
  name: string;
  type: string;
}

export enum Permission {
  all = "all",
  read = "read",
  write = "write"
}

export enum Role {
  admin = "admin",
  user = "user",
}