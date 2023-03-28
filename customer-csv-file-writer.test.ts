// SOLID
// Single Responsibility Principle
// Open/Closed Principle
// Liskov Substitution Principle
// Interface Segregation Principle
// Dependency Inversion Principle

import { createCustomer, createFileWriter } from "./customer-test-helpers";
import { Customer } from "./customer";
import { createCustomerCsvFileWriter } from "./customer-csv-file-writer";

describe("CustomerCsvFileWriter", () => {
  describe("writeCustomers", () => {
    describe("null customers array", () => {
      test("should throw an argument exception", () => {
        // Arrange
        const fileWriter = createFileWriter();
        const sut = createCustomerCsvFileWriter(fileWriter);
        const fileName = "customers.csv";
        // Act/Assert
        expect(() => sut.writeCustomers(fileName, null!)).toThrowError(
          "customers"
        );
      });
    });

    describe("no customer", () => {
      test("should not write any lines", () => {
        // Arrange
        const fileWriter = createFileWriter();
        const sut = createCustomerCsvFileWriter(fileWriter);
        const fileName = "customers.csv";
        const customers: Customer[] = [];
        // Act
        sut.writeCustomers(fileName, customers);
        // Assert
        fileWriter.assertCustomerWereWrittenToFile(fileName, customers);
      });
    });

    describe("one customer", () => {
      test.each([
        { customer: createCustomer("Peter Wiles", "12345697123") },
        { customer: createCustomer("Brendon Page", "45648484654") },
      ])("customer: $customer", ({ customer }) => {
        // Arrange
        const fileWriter = createFileWriter();
        const sut = createCustomerCsvFileWriter(fileWriter);
        const fileName = "customers.csv";
        const customers = [customer];
        // Act
        sut.writeCustomers(fileName, customers);
        // Assert
        expect(fileWriter.writeLine).toHaveBeenCalledTimes(1);
        fileWriter.assertCustomerWereWrittenToFile(fileName, customers);
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
        fileWriter.assertCustomerWereWrittenToFile(fileName, customers);
      });
    });
  });
});
