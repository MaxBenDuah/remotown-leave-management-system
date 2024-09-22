import UpdateUserPassword from "./UpdateUserPassword";

function ResetPassword() {
  return (
    <div className="h-screen flex align-items-center">
      <div className="max-w-30rem mx-auto p-3  border-round-lg shadow-2">
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

export default ResetPassword;
