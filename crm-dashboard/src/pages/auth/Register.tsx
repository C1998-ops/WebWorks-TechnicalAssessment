import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Logo from "../../../public/favicon.svg";
import { IoMdArrowDropdown } from "react-icons/io";
import { __fetch } from "../../components/FetchApi";
import { useToast } from "@/hooks/useToast";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .required("Please select a valid role")
    .oneOf(["Super Admin", "Admin", "Agent"], "Please select a valid role"),
});

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
}
const registerOptions: Array<{ label: string; value: string }> = [
  {
    label: "Select User Type",
    value: "",
  },
  {
    label: "Super Admin",
    value: "super_admin",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Agent",
    value: "agent",
  },
];
function Register() {
  const [selectedRole, setSelectedRole] = useState<string | "">("");
  const navigate = useNavigate();
  const { addToast } = useToast();
  const handleSubmit = async (
    values: RegisterFormValues,
    {
      setSubmitting,
      setErrors,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setErrors: (errors: any) => void;
    },
  ) => {
    try {
      const response = await __fetch({
        urlPath: "/api/auth/register",
        reqMethodType: "POST",
        reqData: {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        },
      });
      if (response.ok && response.resData) {
        const { user, token } = response.resData.data
        localStorage.setItem(
          "user",
          JSON.stringify(user),
        );
        localStorage.setItem("token", token);
        addToast(response.resData.message || "Registration Successfull!", "success")
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({
        email: error.textReturned || "Registration failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="login-bg flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-[400px]">
          <div className="flex justify-center py-8 px-10">
            <img src={Logo} alt="Logo" className="h-16" />
          </div>
          <Formik
            initialValues={{ name: "", email: "", password: "", role: "" }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="px-8 pb-8 space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="form-label font-semibold text-neutral-dark"
                  >
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="form-input w-full p-2 border rounded-md border-gray-300"
                    placeholder="Enter your name"
                  />
                  {errors.name && touched.name && (
                    <div className="form-error">{errors.name}</div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="form-label font-semibold text-neutral-dark"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-input w-full p-2 border rounded-md border-gray-300"
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && (
                    <div className="form-error">{errors.email}</div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="form-label font-semibold text-neutral-dark"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-input w-full p-2 border rounded-md border-gray-300"
                    placeholder="Enter your password"
                  />
                  {errors.password && touched.password && (
                    <div className="form-error">{errors.password}</div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="form-label font-semibold text-neutral-dark"
                  >
                    Role
                  </label>
                  <div className="custom-select-wrapper">
                    <Field
                      as="select"
                      id="role"
                      name="role"
                      className="custom-select w-full p-2 border rounded-md border-gray-300 bg-white text-neutral-textGrey h-[2.8rem]"
                      onChange={(e: any) => {
                        setFieldValue("role", e?.target.value);
                        setSelectedRole(e?.target.value);
                      }}
                    >
                      {registerOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <span className="custom-select-icon">
                      <IoMdArrowDropdown size={25} />
                    </span>
                  </div>

                  {errors.role && touched.role && (
                    <div className="form-error">{errors.role}</div>
                  )}
                </div>
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="secondary"
                  >
                    Submit
                  </Button>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs sm:text-sm text-neutral-textGrey">
                    Already have an account?
                  </p>
                  <Link
                    to="/login"
                    className="text-xs sm:text-sm font-semibold text-primary"
                  >
                    Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Register;
