import { Divider } from "primereact/divider";
import { useUser } from "./useUser";
import { Button } from "primereact/button";
import { useMoveBack } from "../../hooks/useMoveBack";

import UpdateUserPassword from "./UpdateUserPassword";
import UpdateUserDataForm from "./UpdateUserDataForm";

function Account() {
  const { user } = useUser();
  const {
    user_metadata: { name, email },
  } = user;
  const goBack = useMoveBack();

  const userData = { name, email };
  return (
    <div className="pt-4">
      <div
        className="mx-auto shadow-2 p-5 border-round-md"
        style={{ maxWidth: "640px" }}
      >
        <Button
          icon="pi pi-arrow-left"
          rounded
          outlined
          aria-label="Go back"
          onClick={goBack}
        />
        <h1 className="text-center text-xl md:text-left md:text-4xl">
          Update User Account
        </h1>
        <UpdateUserDataForm userData={userData} />
        <Divider />
        <h1 className="text-center text-xl md:text-left md:text-4xl">
          Update Password
        </h1>
        <p className="text-center md:text-left">
          Please enter your new password
        </p>
        <UpdateUserPassword />
      </div>
    </div>
  );
}

export default Account;
