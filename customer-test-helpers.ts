import { FileWriter } from "./file-writer";
import { Customer } from "./customer";

export interface MockFileWriter extends FileWriter {
  assertCustomerWereWrittenToFile(
    fileName: string,
    customers: Customer[]
  ): void;
  assertCustomerWasWrittenToFile(fileName: string, customer: Customer): void;
  assertNumberOfCustomersWritten(numberOfCustomers: number): void;
}

export function createFileWriter(): MockFileWriter {
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
    assertNumberOfCustomersWritten: function (numberOfCustomers: number) {
      expect(this.writeLine).toHaveBeenCalledTimes(numberOfCustomers);
    },
  };
}

export function createCustomer(name: string, contactNumber: string) {
  return new Customer(name, contactNumber);
}

export function createCustomers(numberOfCustomers: number): Customer[] {
  const customers: Customer[] = [];
  for (let i = 0; i < numberOfCustomers; i += 1) {
    customers.push(createCustomer(i.toString(), i.toString()));
  }
  return customers;
}
