import { useRef, useState } from "react";
import { useForgottenPassword } from "./useForgottenPassword";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Link } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const toast = useRef(null);

  const { mutate: resetPasword, isPending } = useForgottenPassword();

  function handleSubmit(e) {
    e.preventDefault();

    if (!email) return;

    resetPasword(
      { email },
      {
        onSuccess: () => {
          toast.current.show({
            severity: "success",
            summary: "Password Reset Email Sent",
            detail:
              "Check your inbox for a link to reset your password. If you don't see it, check your spam folder.",
            life: 6000,
          });
        },
        onError: (error) => {
          toast.current.show({
            severity: "error",
            summary: "Password Reset Failed",
            detail: `We couldn't send a password reset email. Please try again later or ensure the email is correct. - ${error.message}`,
            life: 6000,
          });
        },
        onSettled: () => {
          setEmail("");
        },
      }
    );
  }

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <div className="flex flex-wrap">
        <div className="">
          <img
            src="/forgot-password-bg.png"
            alt="Forgot Password"
            className=""
          />
        </div>
        <div className="flex-1 px-8 pt-8">
          <div className="">
            <div>
              <h2>Reset Password</h2>
              <p className="capitalize">Let us help you!</p>
              <form onSubmit={handleSubmit} className="mt-8">
                <p className="text-xs text-center text-500 font-medium mb-4">
                  Enter your registered email address.
                </p>
                <FloatLabel className="mb-8">
                  <InputText
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                  <label htmlFor="email">Email</label>
                </FloatLabel>
                <Button
                  label="Reset My Password"
                  icon="pi pi-check"
                  loading={isPending}
                  type="submit"
                  className="w-full"
                />
              </form>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="no-underline text-blue-500 hover:text-blue-600 transition-all transition-duration-200 transition-ease-in"
            >
              Login?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordForm;
