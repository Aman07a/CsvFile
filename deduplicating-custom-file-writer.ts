import { Customer } from "./customer";
import { CustomerFileWriter } from "./CustomerFileWriter";

export class DeduplicatingCustomerFileWriter implements CustomerFileWriter {
  constructor(private customerFileWriter: CustomerFileWriter) {}
  writeCustomers(fileName: string, customers: Customer[]) {
    const deduplicatedCustomers = customers.filter(
      (customer, index, array) =>
        array.findIndex((cust) => customer.name === cust.name) === index
    );
    this.customerFileWriter.writeCustomers(fileName, deduplicatedCustomers);
  }
}
