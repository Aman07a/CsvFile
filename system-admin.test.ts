import { BatchedCustomerFileWriter } from "./batched-customer-file-writer";
import { CustomerCsvFileWriter } from "./customer-csv-file-writer";
import { createCustomers, createFileWriter } from "./customer-test-helpers";
import { DeduplicatingCustomerFileWriter } from "./deduplicating-custom-file-writer";

describe("requirement 5", () => {
  test("learning", () => {
    const customers = createCustomers(20000);

    const fileWriter = createFileWriter();
    const csvFileWriter = new CustomerCsvFileWriter(fileWriter);

    // 15000-batch, with deduplication
    const writer = new DeduplicatingCustomerFileWriter(
      new BatchedCustomerFileWriter(csvFileWriter, 15000)
    );

    // 20-batch, no deduplication
    const debugWriter = new BatchedCustomerFileWriter(csvFileWriter, 20);

    writer.writeCustomers("customers.csv", customers);
    debugWriter.writeCustomers("debug-customers.csv", customers);
  });
});
