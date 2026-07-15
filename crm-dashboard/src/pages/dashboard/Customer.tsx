import { Button, ModalParent, SearchBar } from "@/components";
import DataTable from "@/components/TableComponent";
import { TableColumn } from "@/components/TableComponent/types";
import { useCustomers } from "@/hooks/useCustomers";
import { CreateCustomerInput, CustomerRow } from "@/types/customer";
import CreatorLead from "../CreatorLead";
import { useMemo, useState } from "react";

export const Customer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<CreateCustomerInput | null>(
    null,
  );
  const { customers, isLoading, isError } = useCustomers();

  const columns: TableColumn<CustomerRow>[] = [
    { key: "name", header: "Name", width: "200px" },
    { key: "email", header: "Email", width: "250px" },
    { key: "phone", header: "Phone", width: "150px" },
    { key: "company", header: "Company", width: "200px" },
    { key: "isActive", header: "Status", width: "200px" },
    { key: "address", header: "Address", width: "250px" },
    { key: "createdAt", header: "Created", width: "120px" },
  ];

  const filteredCreators = useMemo(() => {
    if (!customers) return [];
    if (!searchQuery) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(query),
    );
  }, [customers, searchQuery]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      {/* ── page header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-primary-orange">
            Creator Management
          </p>
          <h1 className="mt-1 text-h3 font-primary text-primary-navy">
            Creator Management Dashboard
          </h1>
        </div>
      </div>

      {/* ── main content: table ── */}
      <section className="rounded-lg border border-neutral-lightBorder bg-white p-4 shadow-small w-full">
        {/* toolbar */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            placeholder="Search Creators..."
            className="w-full md:w-64"
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery || ""}
          />
          <Button
            variant="primary"
            size="small"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Add Creator
          </Button>
        </div>

        {/* table */}
        <div className="flex gap-4 items-start min-w-0">
          <div className="overflow-x-auto min-w-0 transition-all duration-300 w-full">
            {isError ? (
              <div className="text-center py-8 text-red-500">
                Failed to load Creators. Please try again.
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredCreators}
                className={{
                  table: "min-w-[1180px] whitespace-nowrap",
                  tableHeader: "bg-neutral-light",
                  tableHeaderCell:
                    "px-4 py-3 text-left text-xs font-bold uppercase text-neutral-textGrey",
                  tableBody: "divide-y divide-neutral-lightBorder bg-white",
                  tableRow:
                    "group border-t border-neutral-lightBorder transition-colors duration-200 hover:bg-secondary-green-700",
                  tableCell: "px-4 py-3 text-sm align-middle",
                }}
                totalCount={filteredCreators.length}
                loading={isLoading}
                pagination={{
                  currentPage,
                  onPageChange: setCurrentPage,
                  pageSize,
                  setPageSize: (size: number) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  },
                }}
                onRowClick={(row) => {
                  setSelectedRow((prev) => {
                    if (prev?.id === row.id) return null;
                    // Convert isActive from string to number for editing
                    return {
                      ...row,
                      isActive: row.isActive === "Active" ? 1 : 0,
                    } as CreateCustomerInput;
                  });
                }}
              />
            )}
          </div>
        </div>
        <ModalParent
          isOpen={modalOpen || !!selectedRow}
          onClose={() => {
            if (modalOpen) setModalOpen(false);
            else setSelectedRow(null);
          }}
          size="full"
        >
          <CreatorLead
            onCancel={() => {
              if (modalOpen) setModalOpen(false);
              else setSelectedRow(null);
            }}
            leadId={selectedRow?.id || ""}
            lead={selectedRow as CreateCustomerInput | undefined}
          />
        </ModalParent>
      </section>
    </div>
  );
};
