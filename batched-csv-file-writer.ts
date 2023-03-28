import { Customer } from "./customer";
import { CustomerFileWriter } from "./CustomerFileWriter";

export class BatchedCustomerCsvFileWriter implements CustomerFileWriter {
  constructor(
    private customerFileWriter: CustomerFileWriter,
    private batchSize: number = 10
  ) {}

  writeCustomers(fileName: string, customers: Customer[]) {
    if (customers.length > this.batchSize) {
      const extensionStart = fileName.lastIndexOf(".");
      let baseFileName = fileName.substring(0, extensionStart) || fileName;
      let extension =
        extensionStart > 0 ? fileName.substring(extensionStart) : "";
      let batchFileName = "";
      let batchStart = 0;
      let batchEnd = 0;
      let batchCount = Math.ceil(customers.length / this.batchSize);
      for (let batch = 1; batch <= batchCount; batch += 1) {
        batchFileName = baseFileName + batch + extension;
        batchStart = (batch - 1) * this.batchSize;
        batchEnd = batchStart + this.batchSize;
        this.customerFileWriter.writeCustomers(
          batchFileName,
          customers.slice(batchStart, batchEnd)
        );
      }
    } else {
      this.customerFileWriter.writeCustomers(fileName, customers);
    }
  }
}
