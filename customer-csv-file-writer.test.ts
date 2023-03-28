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
        assertCustomerWereWrittenToFile(fileWriter, fileName, customers);
        expect(fileWriter.writeLine).toHaveBeenCalledTimes(customers.length);
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
        assertCustomerWereWrittenToFile(fileWriter, fileName, customers);
        expect(fileWriter.writeLine).toHaveBeenCalledTimes(customers.length);
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
        assertCustomerWereWrittenToFile(fileWriter, fileName, customers);
        expect(fileWriter.writeLine).toHaveBeenCalledTimes(customers.length);
      });
    });
  });

  describe("writeCustomersBatched", () => {
    describe("less than 10 customers", () => {
      test("should not batch in one group", () => {
        // Arrange
        const customers = createCustomers(8);
        const fileWriter = createFileWriter();
        const sut = createCustomerCsvFileWriter(fileWriter);
        const fileName = "batchedcust.csv";
        // Act
        sut.writeCustomersBatched(fileName, customers);
        // Assert
        assertCustomerWereWrittenToFile(fileWriter, fileName, customers);
        expect(fileWriter.writeLine).toHaveBeenCalledTimes(customers.length);
      });
    });

    describe("more than 10 customers", () => {
      test("given 12 should batch in groups of 10 and 2", () => {
        // Arrange
        const customers = createCustomers(12);
        const fileWriter = createFileWriter();
        const sut = createCustomerCsvFileWriter(fileWriter);
        // Act
        sut.writeCustomersBatched("batchedcust.csv", customers);
        // Assert
        assertCustomerWereWrittenToFile(
          fileWriter,
          "batchedcust1.csv",
          customers.slice(0, 10)
        );
        assertCustomerWereWrittenToFile(
          fileWriter,
          "batchedcust2.csv",
          customers.slice(10, 12)
        );
        expect(fileWriter.writeLine).toHaveBeenCalledTimes(customers.length);
      });

      test("given 23 should batch in groups of 10, 10 and 3", () => {
        // Arrange
        const customers = createCustomers(23);
        const fileWriter = createFileWriter();
        const sut = createCustomerCsvFileWriter(fileWriter);
        // Act
        sut.writeCustomersBatched("batchedcustomers.txt", customers);
        // Assert
        assertCustomerWereWrittenToFile(
          fileWriter,
          "batchedcustomers1.txt",
          customers.slice(0, 10)
        );
        assertCustomerWereWrittenToFile(
          fileWriter,
          "batchedcustomers2.txt",
          customers.slice(10, 20)
        );
        assertCustomerWereWrittenToFile(
          fileWriter,
          "batchedcustomers3.txt",
          customers.slice(20, 23)
        );
        expect(fileWriter.writeLine).toHaveBeenCalledTimes(customers.length);
      });
    });
  });
});

function createCustomers(numberOfCustomers: number): Customer[] {
  const customers: Customer[] = [];
  for (let i = 0; i < numberOfCustomers; i += 1) {
    customers.push(createCustomer(i.toString(), i.toString()));
  }
  return customers;
}

function assertCustomerWereWrittenToFile(
  fileWriter: FileWriter,
  fileName: string,
  customers: Customer[]
) {
  customers.forEach((customer) => {
    assertCustomerWasWrittenToFile(fileWriter, fileName, customer);
  });
}

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

interface MockFileWriter extends FileWriter {
  assertCustomerWereWrittenToFile(
    fileName: string,
    customers: Customer[]
  ): void;
  assertCustomerWasWrittenToFile(fileName: string, customer: Customer): void;
}

function createFileWriter(): MockFileWriter {
  return {
    writeLine: jest.fn(),
    assertCustomerWereWrittenToFile: function (
      fileName: string,
      customers: Customer[]
    ) {
      customers.forEach((customer) => {
        this.assertCustomerWasWrittenToFile(fileName, customer);
      });
    },
    assertCustomerWasWrittenToFile: function (
      fileName: string,
      customer: Customer
    ) {
      expect(this.writeLine).toHaveBeenCalledWith(
        fileName,
        `${customer.name},${customer.contactNumber}`
      );
    },
  };
}

function createCustomerCsvFileWriter(fileWriter: FileWriter) {
  return new CustomerCsvFileWriter(fileWriter);
}

function createCustomer(name: string, contactNumber: string) {
  return new Customer(name, contactNumber);
}
