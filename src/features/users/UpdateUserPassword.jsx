import { useRef, useState } from "react";
import { useUpdateCurrentUser } from "./useUpdateCurrentUser";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FloatLabel } from "primereact/floatlabel";

function UpdateUserPassword() {
  const [password, setPassword] = useState("");
  const toast = useRef(null);

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

  const {
    mutate: updatePassword,
    isPending: isUpdating,
    isError,
    error,
  } = useUpdateCurrentUser();

  if (isError) return <p>{error.message}</p>;

  function handleSubmit(e) {
    e.preventDefault();

    if (!updatePassword) return;

    updatePassword(
      { password },
      {
        onSuccess: () => {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Password updated successfully!",
            life: 5000,
          });
          setPassword("");
        },
        onError: (error) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `Failed to update password: ${error.message}`,
            life: 5000,
          });
        },
      }
    );
  }

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <form onSubmit={handleSubmit}>
        <div className="grid pt-6">
          <div className="col-6">
            <FloatLabel>
              <Password
                inputId="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                header={header}
                footer={footer}
                toggleMask
                className="w-full"
              />
              <label htmlFor="password">Password</label>
            </FloatLabel>
          </div>
          <div className="col-6">
            <Button
              label="Update Password"
              icon="pi pi-check"
              type="submit"
              autoFocus
              className="w-full"
              loading={isUpdating}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateUserPassword;
