import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "./useSignUp";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";
import { FloatLabel } from "primereact/floatlabel";

import Loader from "../../ui/Loader";

const loginData = [
  {
    id: 1,
    icon: "pi-calendar",
    title: "Manage Your Leaves",
    description:
      "Track, submit, and review your leave requests with ease, ensuring a smooth workflow and efficient approvals.",
  },
  {
    id: 2,
    icon: "pi-calendar-plus",
    title: "Quick Holiday Glance",
    description:
      "Stay informed about upcoming holidays and observances, allowing for better planning and scheduling.",
  },
  {
    id: 3,
    icon: "pi-user-edit",
    title: "Update User Profile",
    description:
      "Easily update your personal details, including your profile picture, to keep your account information current.",
  },
  {
    id: 4,
    icon: "pi-key",
    title: "Change Your Password",
    description:
      "Keep your account secure by regularly updating your password for enhanced safety and peace of mind.",
  },
];

const header = <div className="font-bold mb-3">Pick a password</div>;
const footer = (
  <>
    <Divider />
    <p className="mt-2">Suggestions</p>
    <ul className="pl-2 ml-2 mt-0 line-height-3">
      <li>At least one lowercase</li>
      <li>At least one uppercase</li>
      <li>At least one numeric</li>
      <li>Minimum 8 characters</li>
    </ul>
  </>
);

function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const toast = useRef(null);

  const roles = ["Employee", "Manager"];

  const { mutate: signup, isPending } = useSignUp();

  function handleSubmit(e) {
    e.preventDefault();

    if (!fullName || !email || !department || !password || !role) return;

    signup(
      {
        email,
        password,
        role,
        name: fullName,
        department,
      },
      {
        onSuccess: () => {
          toast.current.show({
            severity: "success",
            summary: "Sign Up Successful",
            detail:
              "Welcome to Remotown! Your account has been created successfully.",
            life: 5000,
          });

          setTimeout(() => {
            navigate("/login");
          }, 6000);
        },
        onError: (error) => {
          toast.current.show({
            severity: "error",
            summary: "Sign Up Failed",
            detail: `There was an issue creating your account. Please try again later. - ${error.message}`,
            life: 5000,
          });
        },
        onSettled: () => {
          setFullName("");
          setEmail("");
          setPassword("");
          setDepartment("");
          setRole("");
        },
      }
    );
  }

  return (
    <>
      {isPending && <Loader />}
      <Toast ref={toast} position="top-center" />
      <div
        className="px-2 py-4 md:px-6 lg:px-4"
        style={{
          backgroundImage: "url('signup-bg.webp')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-wrap">
          <div
            className="w-full lg:w-6 p-4 lg:p-7"
            style={{ backgroundColor: "rgba(255,255,255,.9)" }}
          >
            <div className="mb-4">
              <Image src="/remotownLogo.svg" alt="Image" width="200" />
            </div>
            <div className="text-xl text-black-alpha-90 font-500 mb-3">
              Welcome to Remotown&apos;s Leave Management System
            </div>
            <p className="text-black-alpha-50 line-height-3 mt-0 mb-6">
              Efficiently manage your leaves, track holidays, and keep your
              profile up to date!
            </p>
            <ul className="list-none p-0 m-0">
              {loginData.map((data) => (
                <li key={data.id} className="flex align-items-start mb-4">
                  <div>
                    <span
                      className="flex align-items-center justify-content-center bg-cyan-400"
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                      }}
                    >
                      <i className={`text-xl text-white pi ${data.icon}`}></i>
                    </span>
                  </div>
                  <div className="ml-3">
                    <span className="font-medium text-black-alpha-90">
                      {data.title}
                    </span>
                    <p className="mt-2 mb-0 text-black-alpha-50 line-height-3">
                      {data.description}{" "}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-6 p-4 lg:p-7 surface-card">
            <div className="text-900 text-2xl font-medium mb-5 capitalize">
              Sign up
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <FloatLabel className="mb-5">
                  <InputText
                    id="fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <label htmlFor="fullname">Full Name</label>
                </FloatLabel>
                <FloatLabel className="mb-5">
                  <InputText
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">Email</label>
                </FloatLabel>
                <FloatLabel className="mb-5">
                  <Password
                    inputId="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    toggleMask
                    header={header}
                    footer={footer}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </FloatLabel>
                <FloatLabel className="mb-5">
                  <InputText
                    id="department"
                    value={department}
                    onChange={(e) =>
                      setDepartment(e.target.value.toUpperCase())
                    }
                    required
                  />
                  <label htmlFor="department">Department</label>
                </FloatLabel>
                <FloatLabel className="mb-5">
                  <Dropdown
                    inputId="role"
                    value={role}
                    onChange={(e) => setRole(e.value)}
                    options={roles}
                    optionLabel="name"
                    className="w-full"
                    showClear
                  />
                  <label htmlFor="role">Select a Role</label>
                </FloatLabel>
                <div>
                  <Button
                    label="Submit"
                    className="w-full"
                    type="submit"
                    loading={isPending}
                  />
                </div>
              </form>
            </div>
            <Divider align="center">
              <span className="p-tag">OR</span>
            </Divider>
            <div className="mt-4">
              <p className="text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="no-underline text-blue-500 hover:text-blue-600 transition-all transition-duration-200 transition-ease-in"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
