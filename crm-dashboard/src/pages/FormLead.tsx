import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import { FormInput } from "@/components/CustomFormInput";
import { useLeads } from "@/hooks/useLeads";
import { LeadInput } from "@/types/lead";
import { useToast } from "@/hooks/useToast";

export type LeadFormValues = LeadInput;
const LeadFormSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  company: Yup.string().required("Company is required"),
  source: Yup.string().required("Source is required"),
  status: Yup.string().required("Status is required"),
  priority: Yup.string().required("Priority is required"),
  estimated_value: Yup.number()
    .min(0, "Must be positive")
    .required("Estimated value is required"),
  notes: Yup.string(),
  customer_id: Yup.string(),
  assigned_to: Yup.string(),
});
const statusOptions: Array<{ label: string; value: string }> = [
  { label: "New", value: "new" },
  { label: "Assigned Lead", value: "assigned-leads" },
  { label: "Converted Lead", value: "converted-leads" },
  // { label: "Proposal", value: "proposal" },
  // { label: "Negotiation", value: "negotiation" },
  // { label: "Won", value: "won" },
  // { label: "Lost", value: "lost" },
];

const priorityOptions: Array<{ label: string; value: string }> = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];
const sourceOptions: Array<{ label: string; value: string }> = [
  { label: "Website", value: "website" },
  { label: "Referral", value: "referral" },
  { label: "Cold Call", value: "cold_call" },
  { label: "Social Media", value: "social_media" },
  { label: "Email Campaign", value: "email_campaign" },
  { label: "Other", value: "other" },
];
const FormLead: React.FC<{
  onCancel: () => void;
  lead?: LeadFormValues;
  leadId?: string;
}> = ({ onCancel, lead, leadId }) => {
  const isEditMode = !!leadId;
  const initialValues: LeadFormValues = {
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    company: lead?.company || "",
    source: lead?.source || "",
    status: lead?.status || "",
    priority: lead?.priority || "",
    estimated_value: lead?.estimated_value || 0,
    notes: lead?.notes || "",
    customer_id: lead?.customer_id || "",
    assigned_to: lead?.assigned_to || "",
  };
  // const [loading, setLoading] = useState<boolean>(false);
  const { createLead, updateLead, isUpdating } = useLeads();
  const { addToast, success } = useToast();

  const handleSubmit = async (
    values: LeadFormValues,
    helpers: FormikHelpers<LeadFormValues>,
  ) => {
    try {
      // setLoading(true);
      // Transform form values to match backend expected format
      if (isEditMode) {
        const response = await updateLead(leadId, values);
        success(response.resData.message || "Lead updated successfully", 2000);
        console.log("response updated !", response.resData);
      } else {
        const response = await createLead(values);
        success(response.resData.message || "Lead created successfully", 2000);
        console.log("Lead created:", response);
      }
      helpers.resetForm();
      onCancel(); // Close modal after successful creation
    } catch (error) {
      console.error("Error creating lead:", error);
      addToast("Failed to create lead. Please try again.", "error");
    }
  };
  return (
    <div className="w-full flex flex-col max-h-[90vh] p-4 md:p-6 custom-scrollbar">
      <div className="mb-4 sm:mb-6 flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold text-primary-navy">
          {isEditMode ? "Edit Lead" : "Add New Lead"}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-textGrey">
          Fill in the details to create a new lead
        </p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={LeadFormSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, handleChange, values }) => (
          <Form className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormInput
                label="First Name"
                name="first_name"
                type="text"
                placeholder="First name"
                required
                formErrors={touched.first_name && errors.first_name}
                onChange={handleChange}
                value={values.first_name}
              />
              <FormInput
                label="Last Name"
                name="last_name"
                type="text"
                placeholder="Last name"
                required
                formErrors={touched.last_name && errors.last_name}
                onChange={handleChange}
                value={values.last_name}
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                formErrors={touched.email && errors.email}
                onChange={handleChange}
                value={values.email}
              />
              <FormInput
                label="Phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                required
                formErrors={touched.phone && errors.phone}
                onChange={handleChange}
                value={values.phone}
              />
              <FormInput
                label="Company"
                name="company"
                type="text"
                placeholder="Company name"
                required
                formErrors={touched.company && errors.company}
                onChange={handleChange}
                value={values.company}
              />
              <div>
                <label
                  htmlFor="source"
                  className="form-label font-semibold text-neutral-dark"
                >
                  Source
                </label>
                <Field
                  as="select"
                  id="source"
                  name="source"
                  className="w-full p-2 border rounded-md border-gray-300 bg-white text-sm"
                >
                  <option value="">Select source</option>
                  {sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                {errors.source && touched.source && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.source}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="form-label font-semibold text-neutral-dark"
                >
                  Status
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="w-full p-2 border rounded-md border-gray-300 bg-white text-sm"
                >
                  <option value="">Select status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                {errors.status && touched.status && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.status}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="priority"
                  className="form-label font-semibold text-neutral-dark"
                >
                  Priority
                </label>
                <Field
                  as="select"
                  id="priority"
                  name="priority"
                  className="w-full p-2 border rounded-md border-gray-300 bg-white text-sm"
                >
                  <option value="">Select priority</option>
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                {errors.priority && touched.priority && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.priority}
                  </div>
                )}
              </div>
              <FormInput
                label="Estimated Value"
                name="estimated_value"
                type="number"
                placeholder="0"
                required
                formErrors={touched.estimated_value && errors.estimated_value}
                onChange={handleChange}
                value={values.estimated_value}
              />
            </div>
            <div>
              <label
                htmlFor="notes"
                className="form-label font-semibold text-neutral-dark"
              >
                Notes
              </label>
              <Field
                as="textarea"
                id="notes"
                name="notes"
                rows={4}
                className="w-full p-2 border rounded-md border-gray-300 text-sm"
                placeholder="Additional notes about this lead..."
              />
              {errors.notes && touched.notes && (
                <div className="text-red-500 text-xs mt-1">{errors.notes}</div>
              )}
            </div>
            <div className="pt-2 sm:pt-4 flex justify-end gap-2 sm:gap-3">
              <Button
                type="button"
                variant="text"
                onClick={onCancel}
                className="text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUpdating}
                variant="secondary"
                className="text-xs sm:text-sm"
              >
                {isUpdating
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Lead"
                    : "Create Lead"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default FormLead;
