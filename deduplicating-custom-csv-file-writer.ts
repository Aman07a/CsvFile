import { Customer } from "./customer";
import { CustomerCsvFileWriter } from "./customer-csv-file-writer";

export class DeduplicatingCustomerCsvFileWriter {
  constructor(private customerCsvFileWriter: CustomerCsvFileWriter) {}
  writeCustomers(fileName: string, customers: Customer[]) {
    this.customerCsvFileWriter.writeCustomers(fileName, customers);
  }
}
