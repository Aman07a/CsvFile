import { Customer } from "./customer";

export interface CustomerFileWriter {
  writeCustomers(fileName: string, customers: Customer[]): void;
}
