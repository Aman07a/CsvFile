import { Customer } from "./customer";
import { FileWriter } from "./file-writer";

export class CustomerCsvFileWriter {
  constructor(private fileWriter: FileWriter) {}

  writeCustomers(fileName: string, customers: Customer[]) {
    if (customers === null) {
      throw Error("argument is null: `customers`");
    }
    customers.forEach((customer) => {
      this.fileWriter.writeLine(fileName, this.formatAsCsvRow(customer));
    });
  }

  writeCustomersBatched(fileName: string, customers: Customer[]) {
    if (customers.length > 10) {
      this.writeCustomers("batchedcust1.csv", customers.slice(0, 10));
      this.writeCustomers("batchedcust2.csv", customers.slice(10, 12));
    } else {
      this.writeCustomers(fileName, customers);
    }
  }

  private formatAsCsvRow(customer: Customer): string {
    return `${customer.name},${customer.contactNumber}`;
  }
}
