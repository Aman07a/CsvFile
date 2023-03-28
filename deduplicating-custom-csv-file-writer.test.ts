// SOLID
// Single Responsibility Principle
// Open/Closed Principle
// Liskov Substitution Principle
// Interface Segregation Principle
// Dependency Inversion Principle

import { Customer } from "./customer";
import {
  MockFileWriter,
  createCustomer,
  createCustomerCsvFileWriter,
  createFileWriter,
} from "./customer-csv-file-writer.test";
import { DeduplicatingCustomerCsvFileWriter } from "./deduplicating-custom-csv-file-writer";

describe("DeduplicatingCustomerCsvFileWriter", () => {
  describe("writeCustomers", () => {
    describe("no duplicates", () => {
      test("should write all", () => {
        // Arrange
        const customers = createCustomers(8);
        const fileWriter = createFileWriter();
        const sut = createDeduplicatingCustomerCsvFileWriter(fileWriter);
        const fileName = "deduped.csv";
        // Act
        sut.writeCustomers(fileName, customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(fileName, customers);
        fileWriter.assertNumberOfCustomersWritten(customers.length);
      });
    });
  });
});

function createDeduplicatingCustomerCsvFileWriter(fileWriter: MockFileWriter) {
  const csvFileWriter = createCustomerCsvFileWriter(fileWriter);
  return new DeduplicatingCustomerCsvFileWriter(csvFileWriter);
}

function createCustomers(numberOfCustomers: number): Customer[] {
  const customers: Customer[] = [];
  for (let i = 0; i < numberOfCustomers; i += 1) {
    customers.push(createCustomer(i.toString(), i.toString()));
  }
  return customers;
}
