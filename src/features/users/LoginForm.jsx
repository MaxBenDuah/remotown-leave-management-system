import { useNavigate } from "react-router-dom";
import { useLogin } from "./useLogin";
import { useEffect, useRef, useState } from "react";
import { useGetCurrentUser } from "./useGetCurrentUser";
import { useUserDataContext } from "../../contexts/UserContext";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FloatLabel } from "primereact/floatlabel";

import Loader from "../../ui/Loader";

function LoginForm() {
  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("87654321");
  const [userProfile, setUserProfile] = useState(null);
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const { dispatch } = useUserDataContext();
  const toast = useRef(null);

  const { profile } = useGetCurrentUser(userProfile);

  useEffect(
    function () {
      if (profile) {
        dispatch({ type: "addCurrentUser", payload: profile });
      }
    },
    [dispatch, profile]
  );

  useEffect(
    function () {
      if (profile?.role === "Employee") {
        setTimeout(() => {
          navigate("/employee/dashboard");
        }, 3000);
      }

      if (profile?.role === "Manager") {
        setTimeout(() => {
          navigate("/manager/dashboard");
        }, 3000);
      }
    },
    [profile?.role, navigate]
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) return;

    login(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          toast.current.show({
            severity: "success",
            summary: "Login Successful",
            detail: "Welcome back! You have logged in successfully.",
            life: 5000,
          });

          setUserProfile(data);
        },
        onError: (error) => {
          toast.current.show({
            severity: "error",
            summary: "Login Failed",
            detail: `Invalid credentials or an error occurred. Please try again. - ${error.message}`,
            life: 5000,
          });
        },
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  return (
    <>
      <Toast ref={toast} position="top-center" />
      {isPending && <Loader />}
      <div
        className="mx-auto overflow-hidden shadow-3 border-round-lg mt-8"
        style={{ maxWidth: "1280px" }}
      >
        <div className="grid">
          <div className="col-12 p-8 lg:col-6">
            <form onSubmit={handleSubmit}>
              <div className="pb-4">
                <img src="/remotownLogo.svg" alt="Logo" className="w-4" />
              </div>
              <h2 className="mb-4 font-medium text-3xl">Welcome Back</h2>
              <p className="mb-6">
                <span className="text-500">Do not have an account? </span>
                <span>
                  <Link
                    to="/"
                    className="no-underline text-blue-500 hover:text-blue-600 transition-all transition-duration-200 transition-ease-in"
                  >
                    Create today!
                  </Link>
                </span>
              </p>
              <div className="mb-5">
                <FloatLabel>
                  <InputText
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                  <label htmlFor="email">Email</label>
                </FloatLabel>
              </div>
              <div className="mb-5">
                <FloatLabel>
                  <Password
                    inputId="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    toggleMask
                  />
                  <label htmlFor="password">Password</label>
                </FloatLabel>
              </div>

              <div className="flex justify-content-end mb-5">
                <Link
                  to="/forgot-password"
                  className="no-underline text-blue-500 hover:text-blue-600 transition-all transition-duration-200 transition-ease-in"
                >
                  Forgot your password?
                </Link>
              </div>
              <div>
                <Button
                  label="Sign In"
                  className="w-full"
                  loading={isPending}
                />
              </div>
            </form>
          </div>
          <div className="col-12 p-0 lg:col-6">
            <img
              src="/login-banner.jpg"
              alt="Login Banner"
              className="block w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
