import { Customer } from "./customer";
import { FileWriter } from "./file-writer";

export class BatchedCustomerCsvFileWriter {
  constructor(private customerCsvFileWriter: CustomerCsvFileWriter) {}
  writeCustomers(fileName: string, customers: Customer[]) {
    if (customers.length > 10) {
      const extensionStart = fileName.lastIndexOf(".");
      let baseFileName = fileName.substring(0, extensionStart) || fileName;
      let extension =
        extensionStart > 0 ? fileName.substring(extensionStart) : "";
      let batchFileName = "";
      let batchStart = 0;
      let batchEnd = 0;
      let batchCount = Math.ceil(customers.length / 10);
      for (let batch = 1; batch <= batchCount; batch += 1) {
        batchFileName = baseFileName + batch + extension;
        batchStart = (batch - 1) * 10;
        batchEnd = batchStart + 10;
        this.customerCsvFileWriter.writeCustomers(
          batchFileName,
          customers.slice(batchStart, batchEnd)
        );
      }
    } else {
      this.customerCsvFileWriter.writeCustomers(fileName, customers);
    }
  }
}

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

  private formatAsCsvRow(customer: Customer): string {
    return `${customer.name},${customer.contactNumber}`;
  }
}
