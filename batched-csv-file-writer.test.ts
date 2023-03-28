// SOLID
// Single Responsibility Principle
// Open/Closed Principle
// Liskov Substitution Principle
// Interface Segregation Principle
// Dependency Inversion Principle

import { Customer } from "./customer";
import { BatchedCustomerCsvFileWriter } from "./batched-csv-file-writer";
import {
  MockFileWriter,
  createCustomer,
  createCustomerCsvFileWriter,
  createFileWriter,
} from "./customer-csv-file-writer.test";

describe("BatchedCustomerCsvFileWriter", () => {
  describe("writeCustomers", () => {
    describe("less than 10 customers", () => {
      test("should not batch in one group", () => {
        // Arrange
        const customers = createCustomers(8);
        const fileWriter = createFileWriter();
        const sut = createBatchedCustomerCsvFileWriter(fileWriter);
        const fileName = "batchedcust.csv";
        // Act
        sut.writeCustomers(fileName, customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(fileName, customers);
        fileWriter.assertNumberOfCustomersWritten(customers.length);
      });
    });

    describe("more than 10 customers", () => {
      test("given 12 should batch in groups of 10 and 2", () => {
        // Arrange
        const customers = createCustomers(12);
        const fileWriter = createFileWriter();
        const sut = createBatchedCustomerCsvFileWriter(fileWriter);
        // Act
        sut.writeCustomers("batchedcust.csv", customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(
          "batchedcust1.csv",
          customers.slice(0, 10)
        );
        fileWriter.assertCustomerWereWrittenToFile(
          "batchedcust2.csv",
          customers.slice(10, 12)
        );
      });

      test("given 23 should batch in groups of 10, 10 and 3", () => {
        // Arrange
        const customers = createCustomers(23);
        const fileWriter = createFileWriter();
        const sut = createBatchedCustomerCsvFileWriter(fileWriter);
        // Act
        sut.writeCustomers("batchedcustomers.txt", customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(
          "batchedcustomers1.txt",
          customers.slice(0, 10)
        );
        fileWriter.assertCustomerWereWrittenToFile(
          "batchedcustomers2.txt",
          customers.slice(10, 20)
        );
        fileWriter.assertCustomerWereWrittenToFile(
          "batchedcustomers3.txt",
          customers.slice(20, 23)
        );
      });

      test("should write all", () => {
        // Arrange
        const customers = createCustomers(100);
        const fileWriter = createFileWriter();
        const sut = createBatchedCustomerCsvFileWriter(fileWriter);
        // Act
        sut.writeCustomers("batchedcustomers.txt", customers);
        // Assert
        fileWriter.assertNumberOfCustomersWritten(customers.length);
      });

      test("should name files correctly without extension", () => {
        // Arrange
        const customers = createCustomers(15);
        const fileWriter = createFileWriter();
        const sut = createBatchedCustomerCsvFileWriter(fileWriter);
        // Act
        sut.writeCustomers("noext", customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(
          "noext1",
          customers.slice(0, 10)
        );
        fileWriter.assertCustomerWereWrittenToFile(
          "noext2",
          customers.slice(10, 20)
        );
      });
    });

    describe("different batch size", () => {
      test("should still batch in correctly sized groups", () => {
        // Arrange
        const customers = createCustomers(8);
        const fileWriter = createFileWriter();
        const sut = createBatchedCustomerCsvFileWriterWithBatchSize(
          fileWriter,
          5
        );
        // Act
        sut.writeCustomers("batchedcustomers.txt", customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(
          "batchedcustomers1.txt",
          customers.slice(0, 5)
        );
        fileWriter.assertCustomerWereWrittenToFile(
          "batchedcustomers2.txt",
          customers.slice(5, 8)
        );
      });
    });
  });
});

function createBatchedCustomerCsvFileWriter(fileWriter: MockFileWriter) {
  const csvFileWriter = createCustomerCsvFileWriter(fileWriter);
  return new BatchedCustomerCsvFileWriter(csvFileWriter);
}

function createBatchedCustomerCsvFileWriterWithBatchSize(
  fileWriter: MockFileWriter,
  batchSize: number
) {
  const csvFileWriter = createCustomerCsvFileWriter(fileWriter);
  return new BatchedCustomerCsvFileWriter(csvFileWriter, batchSize);
}

function createCustomers(numberOfCustomers: number): Customer[] {
  const customers: Customer[] = [];
  for (let i = 0; i < numberOfCustomers; i += 1) {
    customers.push(createCustomer(i.toString(), i.toString()));
  }
  return customers;
}
