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
      let baseFileName = fileName.substring(0, fileName.lastIndexOf("."));
      let extension = fileName.substring(fileName.lastIndexOf("."));
      let batchFileName = "";
      let batchStart = 0;
      let batchEnd = 0;
      let batchCount = Math.ceil(customers.length / 10);
      for (let batch = 1; batch <= batchCount; batch += 1) {
        batchFileName = baseFileName + batch + extension;
        batchStart = (batch - 1) * 10;
        batchEnd = batchStart + 10;
        this.writeCustomers(
          batchFileName,
          customers.slice(batchStart, batchEnd)
        );
      }
    } else {
      this.writeCustomers(fileName, customers);
    }
  }

  private formatAsCsvRow(customer: Customer): string {
    return `${customer.name},${customer.contactNumber}`;
  }
}
