import { useRef, useState } from "react";
import { useUpdateCurrentUser } from "./useUpdateCurrentUser";
import { InputText } from "primereact/inputtext";
import FileUploader from "../../ui/FileUploader";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";

function UpdateUserDataForm({ userData: { name, email } }) {
  const toast = useRef(null);
  const [updateName, setUpdateName] = useState(name);
  const [avatar, setAvatar] = useState(null);

  const {
    mutate: updateUser,
    isPending: isUpdating,
    // isError,
    // error,
  } = useUpdateCurrentUser();

  function handleSubmit(e) {
    e.preventDefault();

    updateUser(
      { updateName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          e.target.reset();
          setUpdateName("");

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: avatar
              ? "Avatar uploaded successfully!"
              : "Username updated successfully!",
            life: 3000,
          });
        },
        onError: (error) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: avatar
              ? `There was an issue uploading your avatar. Please try again. - ${error.message}`
              : `There was an issue updating your name. Please try again. - ${error.message}`,
            life: 3000,
          });
        },
      }
    );
  }

  return (
    <div>
      <Toast ref={toast} position="top-center" />
      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="col-6 pt-6" style={{ cursor: "not-allowed" }}>
            <FloatLabel>
              <InputText
                type="text"
                id="email"
                disabled
                className="w-full"
                value={email}
                style={{
                  backgroundColor: "#e5e7eb",
                  color: "#9ca3af",
                }}
              />
              <label htmlFor="email">Email</label>
            </FloatLabel>
          </div>
          <div className="col-6 pt-6">
            <FloatLabel>
              <InputText
                id="username"
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
                className="w-full"
              />
              <label htmlFor="username">Username</label>
            </FloatLabel>
          </div>
          <div className="col-12">
            <FileUploader avatar={avatar} setAvatar={setAvatar} />
          </div>
        </div>
        <div className="flex justify-content-end">
          <Button
            label="Submit"
            icon="pi pi-check"
            type="submit"
            autoFocus
            loading={isUpdating}
          />
        </div>
      </form>
    </div>
  );
}

export default UpdateUserDataForm;
