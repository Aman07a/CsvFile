import { Customer } from './customer';
import { CustomerCsvFileWriter } from './customer-csv-file-writer';

export class BatchedCustomerCsvFileWriter {
  constructor(
    private customerCsvFileWriter: CustomerCsvFileWriter,
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
