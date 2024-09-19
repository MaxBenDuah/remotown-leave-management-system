import { useSearchParams } from "react-router-dom";
import { useGetAllLeaveRequest } from "../features/employees/useGetAllLeaveRequest";
import { useGetEmployee } from "../features/employees/useGetEmployee";
import { useUser } from "../features/users/useUser";
import { useEffect } from "react";
import { Envelope, UserCircleGear, UsersFour } from "@phosphor-icons/react";

import ManagerTable from "../ui/ManagerTable";
import TimeAndDate from "../ui/TimeAndDate";
import Holidays from "../ui/Holidays";
import Loader from "../ui/Loader";

function ManagerDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();
  const { data, isLoading, isError, error } = useGetEmployee(user);
  const {
    data: allLeaveRequest,
    isLoading: isLoading3,
    isError: isError3,
    error: error3,
  } = useGetAllLeaveRequest();

  useEffect(
    function () {
      if (data) {
        searchParams.set("employee_id", data.id);
        setSearchParams(searchParams);
      }
    },
    [data, searchParams, setSearchParams]
  );

  if (isLoading || isLoading3) return <Loader />;

  if (isError) return <p>{error.message}</p>;

  if (isError3) return <p>{error3.message}</p>;

  const { name, email, role, department } = data;
  const {
    user_metadata: { name: metaDataName },
  } = user;

  return (
    <>
      <div className="pt-4" style={{ background: "#F9FAFB" }}>
        <div className="grid nested-grid">
          <div className="col-12 lg:col-8">
            <div className="grid">
              <div
                className="col-12 md:col-6 text-center"
                style={{ background: "#F9FAFB" }}
              >
                <div
                  className="border-round-3xl shadow-2 bg-white"
                  style={{ padding: "13.2px" }}
                >
                  <h3 className="text-3xl font-medium m-0">
                    Welcome,{" "}
                    {metaDataName ? metaDataName.split(" ").at(0) : name}!
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Your profile is looking good!
                  </p>
                </div>
              </div>

              <div className="col-12 md:col-6 border-round-md">
                <div className="flex justify-content-center p-2 gap-2 border-round-3xl shadow-2 bg-white">
                  <div>
                    <p className="flex flex-column">
                      <span className="text-center">
                        <Envelope size={32} color="#050505" />{" "}
                      </span>
                      <span className="text-gray-500 text-center">{email}</span>
                    </p>
                  </div>
                  <div>
                    <p className="flex flex-column">
                      <span className="text-center">
                        <UserCircleGear size={32} color="#050505" />{" "}
                      </span>
                      <span className="text-gray-500 text-center">{role}</span>
                    </p>
                  </div>
                  <div>
                    <p className="flex flex-column">
                      <span className="text-center">
                        <UsersFour size={32} color="#050505" />{" "}
                      </span>
                      <span className="text-gray-500 text-center">
                        {department}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 border-round-md">
                {allLeaveRequest && (
                  <ManagerTable allLeaveRequest={allLeaveRequest} />
                )}
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-4">
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

export default ManagerDashboard;
