// SOLID
// Single Responsibility Principle
// Open/Closed Principle
// Liskov Substitution Principle
// Interface Segregation Principle
// Dependency Inversion Principle

import { Customer } from "./customer";
import { CustomerCsvFileWriter } from "./customer-csv-file-writer";
import { FileWriter } from "./file-writer";

describe("CustomerCsvFileWriter", () => {
  describe("one customer", () => {
    test.each([
      { customer: createCustomer("Peter Wiles", "12345697123") },
      { customer: createCustomer("Brendon Page", "45648484654") },
    ])("customer: $expected", ({ customer }) => {
      // Arrange
      const fileWriter = createFileWriter();
      const sut = createCustomerCsvFileWriter(fileWriter);
      const fileName = "customers.csv";
      // Act
      sut.writeCustomers(fileName, [customer]);
      // Assert
      expect(fileWriter.writeLine).toHaveBeenCalledTimes(1);
      assertCustomerWasWrittenToFile(fileWriter, fileName, customer);
    });
  });

  describe("many customers", () => {
    test("should write all customers", () => {
      // Arrange
      const customers = [
        createCustomer("Peter Wiles", "12345697123"),
        createCustomer("Brendon Page", "45648484654"),
        createCustomer("Bob", "97987987987"),
      ];
      const fileWriter = createFileWriter();
      const sut = createCustomerCsvFileWriter(fileWriter);
      const fileName = "cust.csv";
      // Act
      sut.writeCustomers(fileName, customers);
      // Assert
      expect(fileWriter.writeLine).toHaveBeenCalledTimes(3);
      assertCustomerWasWrittenToFile(fileWriter, fileName, customers[0]);
      assertCustomerWasWrittenToFile(fileWriter, fileName, customers[1]);
      assertCustomerWasWrittenToFile(fileWriter, fileName, customers[2]);
    });
  });
});

function assertCustomerWasWrittenToFile(
  fileWriter: FileWriter,
  fileName: string,
  customer: Customer
) {
  expect(fileWriter.writeLine).toHaveBeenCalledWith(
    fileName,
    `${customer.name},${customer.contactNumber}`
  );
}

function createFileWriter(): FileWriter {
  return {
    writeLine: jest.fn(),
  };
}

function createCustomerCsvFileWriter(fileWriter: FileWriter) {
  return new CustomerCsvFileWriter(fileWriter);
}

function createCustomer(name: string, contactNumber: string) {
  return new Customer(name, contactNumber);
}
