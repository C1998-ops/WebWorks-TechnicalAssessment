import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../../components/Button";
import Logo from "../../../public/favicon.svg";
import { __fetch } from "@/components/FetchApi";
import { setAuthSession } from "../../utils/authState";
import { useToast } from "@/hooks/useToast";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // const [loginError, setLoginError] = useState<string | null>(null);
  const { addToast } = useToast();
  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    // setLoginError(null);
    try {
      const response = await __fetch({
        urlPath: "/api/auth/login",
        reqMethodType: "POST",
        reqData: { email: values.email, password: values.password },
      });

      const data = response.resData?.data;
      if (data?.token) {
        setAuthSession(data.token, data.user);
        navigate("/dashboard", { replace: true });
        addToast("Login Successfull !", "success");
      } else {
        // setLoginError("Login failed. Please try again.");
        addToast("Login Failed !", "error");
      }
    } catch (error: unknown) {
      const err = error as { textReturned?: string; status?: number };
      try {
        const parsed = JSON.parse(err.textReturned || "");
        // setLoginError(parsed.message || "Login failed. Please try again.");
        addToast(parsed.message || "login Failed", "error");
      } catch {
        // setLoginError(err.textReturned || "Login failed. Please try again.");
        addToast(err?.textReturned || "login Failed", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-purple-100 p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-dark w-full max-w-[320px] sm:max-w-[380px] md:max-w-[450px] flex flex-col items-center py-6 px-4 sm:py-8 sm:px-8 md:py-10 md:px-10">
        <div className="flex justify-center mb-10">
          <img src={Logo} alt="Logo" className="h-10 sm:h-14 md:h-10" />
        </div>
        <div className="w-full border border-neutral-borderGrey rounded-xl p-1 sm:p-6 md:p-2 md:px-8 bg-white shadow-sm">
          <h2 className="text-2xl sm:text-3xl md:text-[24px] font-bold text-black text-center mb-1">
            Welcome Back
          </h2>
          <p className="text-center text-black text-sm sm:text-base font-semibold mb-4">
            Please enter your details.
          </p>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
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
                    className="form-input"
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
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="form-input"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-textGrey hover:text-neutral-textGrey p-0.5 focus:outline-none bg-transparent"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash
                          size={16}
                          className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                        />
                      ) : (
                        <FaEye
                          size={16}
                          className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                        />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <div className="form-error">{errors.password}</div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Link
                    to="#"
                    aria-disabled={isSubmitting}
                    aria-labelledby="Forgot Password"
                    className="text-xs sm:text-sm font-semibold text-primary opacity-50 cursor-not-allowed"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  fullWidth
                  disabled={isSubmitting}
                  size="medium"
                  className="bg-primary text-white rounded-md h-10 mt-2"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <div className="flex gap-1 items-center justify-center mt-2">
                  <Link
                    to="/register"
                    className="text-xs sm:text-sm font-semibold text-primary"
                  >
                    Create An Account
                  </Link>
                </div>
                <span className="font-light text-sm inline-block text-center">
                  Demo application for technical assessment.
                </span>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
