import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import { FormInput } from "@/components/CustomFormInput";
import { useToast } from "@/hooks/useToast";
import { CreateCustomerInput } from "@/types/customer";
import { useCustomers } from "@/hooks/useCustomers";

const CreatorFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  company: Yup.string().required("Company is required"),
  address: Yup.string().optional(),
  isActive: Yup.number().optional().oneOf([0, 1], "Invalid status"),
  notes: Yup.string(),
});
const statusOptions: Array<{ label: string; value: number }> = [
  { label: "Active", value: 1 },
  { label: "De-Active", value: 0 },
];

const CreatorLead: React.FC<{
  onCancel: () => void;
  lead?: CreateCustomerInput;
  leadId?: string;
}> = ({ onCancel, lead, leadId }) => {
  const isEditMode = !!leadId;
  const initialValues: CreateCustomerInput = {
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    company: lead?.company || "",
    address:lead?.address ||"",
    isActive: lead?.isActive || 0,
    notes: lead?.notes || "",
  };
  const { createCustomer, updateCustomer, isUpdating } = useCustomers();
  const { addToast, success } = useToast();

  const handleSubmit = async (
    values: CreateCustomerInput,
    helpers: FormikHelpers<CreateCustomerInput>,
  ) => {
    try {
      // setLoading(true);
      // Transform form values to match backend expected format
      const payload = {
        ...values,
        is_active: values.isActive,
      };
      if (isEditMode) {
        const response = await updateCustomer(leadId, payload);
        success(response.resData.message || "Lead updated successfully", 2000);
        console.log("response updated !", response.resData);
      } else {
        const response = await createCustomer(payload);
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
          {isEditMode ? "Edit Creator" : "Add Creator"}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-textGrey">
          Fill in the details to create a Creator
        </p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={CreatorFormSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, handleChange, values }) => (
          <Form className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormInput
                label="Name"
                name="name"
                type="text"
                placeholder="Name"
                required
                formErrors={touched.name && errors.name}
                onChange={handleChange}
                value={values.name}
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
               <FormInput
                label="Address"
                name="address"
                type="text"
                placeholder="Address..."
                required
                formErrors={touched.address && errors.address}
                onChange={handleChange}
                value={values.address}
              />
              <div>
                <label
                  htmlFor="isActive"
                  className="form-label font-semibold text-neutral-dark"
                >
                  Status
                </label>
                <Field
                  as="select"
                  id="isActive"
                  name="isActive"
                  className="w-full p-2 border rounded-md border-gray-300 bg-white text-sm"
                >
                  <option value="">Select status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                {errors.isActive && touched.isActive && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.isActive}
                  </div>
                )}
              </div>
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
                    ? "Update Creator"
                    : "Create Creator"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default CreatorLead;
