import { DatabaseCustomer, CustomerRow } from "@/types/customer";

export const transformedCustomers = (data: DatabaseCustomer[]) => {
  return data.map(
    (dbCustomer: DatabaseCustomer): CustomerRow => ({
      id: dbCustomer.id,
      name: dbCustomer.name,
      email: dbCustomer.email || "N/A",
      phone: dbCustomer.phone || "N/A",
      company: dbCustomer.company || "N/A",
      address: dbCustomer.address || "N/A",
      notes: dbCustomer.notes || "",
      createdAt: new Date(dbCustomer.created_at).toLocaleDateString(),
      updatedAt: new Date(dbCustomer.updated_at).toLocaleDateString(),
    })
  );
};
