import { Button } from "primereact/button";
import { Envelope, UserCircleGear, UsersFour } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../features/users/useUser";
import { useGetEmployee } from "../features/employees/useGetEmployee";
import { useSearchParams } from "react-router-dom";
import { Toast } from "primereact/toast";

import DialogPopup from "../ui/DialogPopup";
import Holidays from "../ui/Holidays";
import TimeAndDate from "../ui/TimeAndDate";
import Loader from "../ui/Loader";
import EmployeeTable from "../ui/EmployeeTable";

function EmployeeDashboard() {
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useRef(null);
  const { user } = useUser();
  const {
    user_metadata: { name: userName },
  } = user;
  const deleteToast = useRef(null);
  const updateToast = useRef(null);

  const { data, isLoading, isError, error } = useGetEmployee(user);

  // Placed the employee_id in the url so I can use it to get the notifications
  useEffect(
    function () {
      if (data?.id) {
        searchParams.set("employee_id", data.id);
        setSearchParams(searchParams);
      }
    },
    [data?.id, searchParams, setSearchParams]
  );

  if (isLoading) return <Loader />;

  if (isError) return <p>{error.message}</p>;

  const { email, role, department, leave_balance } = data;

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <Toast ref={updateToast} position="top-center" />
      <div className="pt-4" style={{ background: "#F9FAFB" }}>
        <div className="grid nested-grid">
          <div className="col-12 lg:col-10">
            <div className="grid">
              <div
                className="col-12 md:col-6 text-center"
                style={{ background: "#F9FAFB" }}
              >
                <div className="border-round-lg shadow-2 bg-white flex flex-column gap-2 p-2">
                  <h3 className="text-3xl font-medium m-0">
                    Welcome, {userName.split(" ").at(0)}!
                  </h3>
                  <p className="m-0 text-gray-500">
                    Your profile is looking good!
                  </p>
                  <h4 className="m-0">Leave Balance: {leave_balance}</h4>
                </div>
              </div>

              <div className="col-12 md:col-6 border-round-md">
                <div className="flex justify-content-center p-2 md:gap-6 border-round-lg shadow-2 bg-white">
                  <div>
                    <p className="flex flex-column gap-2">
                      <span className="text-center">
                        <Envelope size={24} color="#050505" />{" "}
                      </span>
                      <span className="text-gray-500 text-center">{email}</span>
                    </p>
                  </div>
                  <div>
                    <p className="flex flex-column gap-2">
                      <span className="text-center">
                        <UserCircleGear size={24} color="#050505" />{" "}
                      </span>
                      <span className="text-gray-500 text-center">{role}</span>
                    </p>
                  </div>
                  <div>
                    <p className="flex flex-column gap-2">
                      <span className="text-center">
                        <UsersFour size={24} color="#050505" />{" "}
                      </span>
                      <span className="text-gray-500 text-center">
                        {department}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 border-round-md">
                <div className="flex justify-content-between align-items-center pb-4">
                  <h2 className="text-xl font-medium">All Leave Requests</h2>
                  <Button
                    label="Request Leave"
                    icon="pi pi-plus"
                    raised
                    size="small"
                    onClick={() => setVisible((prev) => !prev)}
                  />
                </div>

                {visible && (
                  <DialogPopup
                    data={data}
                    setVisible={setVisible}
                    visible={visible}
                    toast={toast}
                  />
                )}
                <Toast ref={deleteToast} position="top-center" />
                <EmployeeTable
                  data={data}
                  deleteToast={deleteToast}
                  updateToast={updateToast}
                />
              </div>
            </div>
          </div>

          {/* Time and Date */}
          <div className="col-12 lg:col-2">
            <div className="grid">
              <div className="col-12">
                <TimeAndDate />
              </div>
              <div className="col-12">
                <Holidays />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDashboard;
