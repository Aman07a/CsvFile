// SOLID
// Single Responsibility Principle
// Open/Closed Principle
// Liskov Substitution Principle
// Interface Segregation Principle
// Dependency Inversion Principle

import { Customer } from "./customer";
import { createCustomerCsvFileWriter } from "./customer-csv-file-writer";
import {
  createCustomer,
  createFileWriter,
  MockFileWriter,
} from "./customer-test-helpers";
import { DeduplicatingCustomerFileWriter } from "./deduplicating-custom-file-writer";

describe("DeduplicatingCustomerFileWriter", () => {
  describe("writeCustomers", () => {
    describe("no duplicates", () => {
      test("should write all", () => {
        // Arrange
        const customers = createCustomers(8);
        const fileWriter = createFileWriter();
        const sut = createDeduplicatingCustomerFileWriter(fileWriter);
        const fileName = "deduped.csv";
        // Act
        sut.writeCustomers(fileName, customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(fileName, customers);
        fileWriter.assertNumberOfCustomersWritten(customers.length);
      });
    });

    describe("one duplicate", () => {
      test("should write only one entry of the duplicate", () => {
        // Arrange
        const expected = createCustomer("Peter", "12");
        const customers = [expected, createCustomer("Peter", "123")];
        const fileWriter = createFileWriter();
        const sut = createDeduplicatingCustomerFileWriter(fileWriter);
        const fileName = "deduped.csv";
        // Act
        sut.writeCustomers(fileName, customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(fileName, [expected]);
        fileWriter.assertNumberOfCustomersWritten(1);
      });
    });

    describe("many duplicates", () => {
      test("should write only one entry of each duplicate", () => {
        // Arrange
        const expected1 = createCustomer("Peter", "12");
        const expected2 = createCustomer("Brendon", "12654");
        const expected3 = createCustomer("Bob", "645");
        const customers = [
          expected1,
          createCustomer("Peter", "123"),
          expected2,
          createCustomer("Peter", "654654"),
          expected3,
          createCustomer("Bob", "45454"),
          createCustomer("Bob", "87987987"),
        ];
        const fileWriter = createFileWriter();
        const sut = createDeduplicatingCustomerFileWriter(fileWriter);
        const fileName = "deduped.csv";
        // Act
        sut.writeCustomers(fileName, customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(fileName, [
          expected1,
          expected2,
          expected3,
        ]);
        fileWriter.assertNumberOfCustomersWritten(3);
      });
    });
  });
});

function createDeduplicatingCustomerFileWriter(fileWriter: MockFileWriter) {
  const csvFileWriter = createCustomerCsvFileWriter(fileWriter);
  return new DeduplicatingCustomerFileWriter(csvFileWriter);
}

function createCustomers(numberOfCustomers: number): Customer[] {
  const customers: Customer[] = [];
  for (let i = 0; i < numberOfCustomers; i += 1) {
    customers.push(createCustomer(i.toString(), i.toString()));
  }
  return customers;
}
