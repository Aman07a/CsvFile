import { Customer } from "./customer";
import { CustomerFileWriter } from "./CustomerFileWriter";

export class DeduplicatingCustomerCsvFileWriter implements CustomerFileWriter {
  constructor(private customerFileWriter: CustomerFileWriter) {}
  writeCustomers(fileName: string, customers: Customer[]) {
    this.customerFileWriter.writeCustomers(fileName, customers);
  }
}
