import { Customer } from "./customer";
import { CustomerFileWriter } from "./CustomerFileWriter";

export class DeduplicatingCustomerCsvFileWriter implements CustomerFileWriter {
  constructor(private customerFileWriter: CustomerFileWriter) {}
  writeCustomers(fileName: string, customers: Customer[]) {
    // remove duplicates
    this.customerFileWriter.writeCustomers(fileName, customers);
  }
}
