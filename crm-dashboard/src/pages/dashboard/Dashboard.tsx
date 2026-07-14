import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiMail, FiPhone } from "react-icons/fi";
import DataTable from "@/components/TableComponent";
import { TableColumn } from "@/components/TableComponent/types";
import LeadDetails from "@/components/LeadDetails";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import { ModalParent } from "@/components/ModalParent";
import FormLead from "../FormLead";
import { LeadStatus, LeadPriority, DisplayLead, Lead } from "@/types/lead";
import { useLeads } from "@/hooks/useLeads";

// ─── status / priority maps (unchanged from original) ────────────────────────

const statusStyles: Record<string, string> = {
  all: "bg-neutral-light text-neutral-textGrey border-neutral-lightBorder",
  new: "bg-secondary-purple-100 text-secondary-purple border-secondary-purple-200",
  "assigned-leads":
    "bg-secondary-blue-100 text-secondary-blue-300 border-secondary-blue-200/30",
  "converted-leads":
    "bg-secondary-green-100 text-secondary-green-300 border-secondary-green-200",
};

const priorityStyles: Record<LeadPriority, string> = {
  high: "bg-primary-red",
  medium: "bg-primary-orange",
  low: "bg-secondary-green-500",
};

const filterOptions: LeadStatus[] = [
  "all",
  "new",
  "assigned-leads",
  "converted-leads",
];

// ─── seed data ────────────────────────────────────────────────────────────────

const seedLeads: DisplayLead[] = [
  {
    id: "LD-1048",
    name: "Riya Sharma",
    contact: "+91 98765 40211",
    project: "Confident Whitehouse",
    source: "Website",
    status: "new",
    priority: "High",
    budget: "₹85L",
    // owner: "Aarav",
    lastActivity: "Today, 10:30 AM",
    notes: [
      {
        id: 1,
        text: "Interested in 3BHK. Budget confirmed around ₹80–90L.",
        author: "Aarav",
        time: "Today, 10:30 AM",
        done: false,
      },
    ],
    activities: [
      { icon: "📞", text: "Call logged — 8 min", time: "Today, 10:30 AM" },
      {
        icon: "✉️",
        text: "Brochure sent on WhatsApp",
        time: "Yesterday, 4:15 PM",
      },
    ],
    email: "riyas@gmail.com",
  },
  {
    id: "LD-1047",
    name: "Karthik Menon",
    contact: "+91 98444 91230",
    project: "Confident Platinum",
    source: "Walk-in",
    status: "assigned-leads",
    priority: "High",
    budget: "₹1.2Cr",
    // owner: "Meera",
    lastActivity: "Yesterday",
    notes: [
      {
        id: 1,
        text: "Liked the 4BHK unit on 12th floor. Follow up on pricing.",
        author: "Meera",
        time: "Yesterday, 2:00 PM",
        done: false,
      },
    ],
    activities: [
      { icon: "📍", text: "Site visit completed", time: "Yesterday, 2:00 PM" },
      { icon: "🚶", text: "Walk-in registered", time: "Jun 24, 2024" },
    ],
    email: "karthik@gmail.com",
  },
  {
    id: "LD-1046",
    name: "Ananya Rao",
    contact: "+91 99012 77880",
    project: "Confident Leo",
    source: "Referral",
    status: "converted-leads",
    priority: "Medium",
    budget: "₹62L",
    // owner: "Nikhil",
    lastActivity: "Jun 25",
    notes: [
      {
        id: 1,
        text: "Referred by Rohan Das. Pre-approved loan of ₹55L.",
        author: "Nikhil",
        time: "Jun 25, 2024",
        done: false,
      },
      {
        id: 2,
        text: "Follow up by Friday.",
        author: "Nikhil",
        time: "Jun 24, 2024",
        done: true,
      },
    ],
    activities: [
      { icon: "✅", text: "Qualification call done", time: "Jun 25, 2024" },
      { icon: "👥", text: "Referral source confirmed", time: "Jun 24, 2024" },
    ],
    email: "ananya@gmail.com",
  },
];

// ─── small UI pieces ──────────────────────────────────────────────────────────

function StatusPill({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex min-w-[92px] items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function PriorityDot({ priority }: { priority: LeadPriority }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-navy">
      <span
        className={`h-2.5 w-2.5 rounded-full ${priorityStyles[priority]}`}
        aria-hidden="true"
      />
      {priority}
    </span>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<LeadStatus>("all");
  const [selectedLead, setSelectedLead] = useState<DisplayLead | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalParent, setModalParent] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { leads, isLoading, isError } = useLeads();

  const filteredLeads = useMemo(() => {
    const baseLeads = leads ?? seedLeads;

    let leadsData =
      activeFilter === "all"
        ? baseLeads
        : baseLeads.filter((lead: DisplayLead) => lead.status.toLowerCase() === activeFilter.toLowerCase() as string);

    if (searchQuery) {
      leadsData = leadsData.filter((lead: DisplayLead) =>
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return leadsData;
  }, [activeFilter, searchQuery, leads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, leads]);

  // Adapter: map DisplayLead → shape expected by LeadDetails
  const detailsLead = useMemo(() => {
    if (!selectedLead) return null;

    return {
      id: selectedLead.id,
      first_name: selectedLead.name.split(" ")[0],
      last_name: selectedLead.name.split(" ")[1],
      phone: selectedLead.contact,
      project: selectedLead.project,
      source: selectedLead.source,
      status: selectedLead.status.toLowerCase().replace(" ", "-") as string,
      priority: selectedLead.priority.toLowerCase() as string,
      // owner: selectedLead.owner,
      estimated_value: Number(selectedLead.estimated_value) || 0,
      lastActivity: selectedLead.lastActivity,
      notes: selectedLead.notes,
      activities: selectedLead.activities,
      email: selectedLead.email,
    };
  }, [selectedLead]);

  const columns: TableColumn<DisplayLead>[] = [
    {
      key: "name",
      header: "Lead",
      className: "min-w-[210px]",
      render: (_, row) => (
        <div>
          <p className="text-sm font-semibold text-primary-navy">{row.name}</p>
          <p className="text-xs text-neutral-textGrey">{row.id}</p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      className: "min-w-[150px] text-neutral-dark",
    },
    {
      key: "project",
      header: "Project",
      className: "min-w-[190px] text-primary-navy font-medium",
    },
    {
      key: "source",
      header: "Source",
      className: "min-w-[130px] text-neutral-textGrey",
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[130px]",
      render: (value) => <StatusPill status={value} />,
    },
    {
      key: "priority",
      header: "Priority",
      className: "min-w-[110px]",
      render: (value) => <PriorityDot priority={value} />,
    },
    {
      key: "budget",
      header: "Budget",
      className: "min-w-[100px] text-primary-navy font-semibold",
    },
    {
      key: "lastActivity",
      header: "Last Activity",
      className: "min-w-[130px] text-neutral-textGrey",
    },
    {
      key: "actions",
      header: "",
      className: "min-w-[150px]",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <button
            type="button"
            aria-label={`View ${row.name}`}
            title="View lead"
            onClick={() => {
              setSelectedLead(row);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary-navy transition hover:bg-neutral-navy-light focus:bg-neutral-navy-light focus:outline-none"
          >
            <FiEye size={16} />
          </button>
          <button
            type="button"
            aria-label={`Call ${row.name}`}
            title="Call lead"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-secondary-green-300 transition hover:bg-secondary-green-100 focus:bg-secondary-green-100 focus:outline-none"
          >
            <FiPhone size={16} />
          </button>
          <button
            type="button"
            aria-label={`Email ${row.name}`}
            title="Email lead"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-secondary-blue-200 transition hover:bg-secondary-blue-100 focus:bg-secondary-blue-100 focus:outline-none"
          >
            <FiMail size={16} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${row.name}`}
            title="Edit lead"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary-orange transition hover:bg-secondary-yellow-100 focus:bg-secondary-yellow-100 focus:outline-none"
          >
            <FiEdit2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      {/* ── page header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-primary-yellow">
            Project Management
          </p>
          <h1 className="mt-1 text-h3 font-primary text-primary-navy">
            Project Management Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
          <div className="group rounded-lg border border-neutral-lightBorder bg-white px-5 py-4 shadow-sm hover:shadow-md hover:border-primary-navy/20 hover:bg-secondary-blue-50 transition-all duration-200 cursor-default">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-textGrey mb-1">
              Open Leads
            </p>
            <p className="text-2xl font-bold text-primary-navy group-hover:scale-105 transition-transform duration-200">
              128
            </p>
          </div>
          <div className="group rounded-lg border border-neutral-lightBorder bg-white px-5 py-4 shadow-sm hover:shadow-md hover:border-secondary-green-300/30 hover:bg-secondary-green-50 transition-all duration-200 cursor-default">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-textGrey mb-1">
              Visits
            </p>
            <p className="text-2xl font-bold text-secondary-green-300 group-hover:scale-105 transition-transform duration-200">
              34
            </p>
          </div>
          <div className="group rounded-lg border border-neutral-lightBorder bg-white px-5 py-4 shadow-sm hover:shadow-md hover:border-primary-red/30 hover:bg-secondary-red-50 transition-all duration-200 cursor-default">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-textGrey mb-1">
              Hot
            </p>
            <p className="text-2xl font-bold text-primary-red group-hover:scale-105 transition-transform duration-200">
              18
            </p>
          </div>
        </div>
      </div>

      {/* ── main content: table + side panel ── */}
      <section className="rounded-lg border border-neutral-lightBorder bg-white p-4 shadow-small w-full">
        {/* toolbar */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h2 className="text-subheading-4 font-bold text-primary-navy">
              Leads Pipeline
            </h2>
            <p className="text-sm text-neutral-textGrey">
              Track status, priority, and next activity.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar
              placeholder="Search leads..."
              className="w-full md:w-64"
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery || ""}
            />
            <div className="hidden md:flex items-center border-l border-neutral-lightBorder pl-3">
              <Button
                type="button"
                variant="secondary"
                aria-label="Add new Lead"
                onClick={() => setModalParent(!modalParent)}
              >
                Add New Lead
              </Button>
            </div>
          </div>
        </div>

        {/* filter tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {filterOptions.map((filter) => {
            const baseLeads = leads ?? seedLeads;
            const count =
              filter === "all"
                ? baseLeads.length
                : baseLeads.filter(
                  (lead: any) => lead.status === filter,
                ).length;
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm font-semibold transition ${isActive
                  ? "border-primary-navy bg-primary-navy text-white shadow-sm"
                  : "border-neutral-lightBorder bg-neutral-light text-primary-navy hover:border-primary-orange hover:text-primary-orange"
                  }`}
              >
                {filter}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${isActive
                    ? "bg-white/20 text-white"
                    : "bg-white text-neutral-textGrey"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* table + panel grid */}
        <div className="flex gap-4 items-start min-w-0">
          {/* table — full width normally, flex-1 when panel is open */}
          <div
            className={`overflow-x-auto min-w-0 transition-all duration-300 ${selectedLead ? "flex-1" : "w-full"
              }`}
          >
            <DataTable
              columns={columns}
              data={filteredLeads}
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
              totalCount={filteredLeads?.length ?? 0}
              onRowClick={(row) => {
                setSelectedLead((prev) => (prev?.id === row.id ? null : row));
              }}
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
            />
          </div>

          {/* side panel — fixed width, sticky */}
          {selectedLead && detailsLead && (
            <div className="w-[360px] flex-shrink-0 sticky top-4">
              <LeadDetails
                lead={detailsLead}
                onClose={() => setSelectedLead(null)}
              />
            </div>
          )}
        </div>
      </section>
      <ModalParent
        isOpen={modalParent}
        onClose={() => setModalParent(false)}
        size="full"
      >
        <FormLead onCancel={() => setModalParent(false)} />
      </ModalParent>
    </div>
  );
}

export default Dashboard;
