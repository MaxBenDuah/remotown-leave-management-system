import { useState } from "react";
import { useUpdateLeaveRequest } from "./useUpdateLeaveRequest";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useSearchParams } from "react-router-dom";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";

// setEditId

function UpdateLeaveRequest({ leave, updateToast, onUpdate }) {
  const [startDate, setStartDate] = useState(leave.start_date);
  const [endDate, setEndDate] = useState(leave.end_date);
  const [selectLeaveType, setSelectLeaveType] = useState(leave.leave_type);
  const [selectStatus] = useState(leave.status);
  const [reason, setReason] = useState(leave.comments);

  const [searchParams] = useSearchParams();
  const editId = Number(searchParams.get("editId"));

  const {
    mutate: updateLeaveRequest,
    isPending,
    // isError: isError2,
    // error: error2,
  } = useUpdateLeaveRequest();

  function handleSubmit(e) {
    e.preventDefault();

    updateLeaveRequest(
      {
        id: editId,
        leave_type: selectLeaveType,
        start_date: startDate,
        end_date: endDate,
        status: selectStatus,
        comments: reason,
      },
      {
        onSuccess: (updatedLeave) => {
          onUpdate(updatedLeave);
          // setEditId(null);
          updateToast.current.show({
            severity: "success",
            summary: "Success",
            detail: "The leave request has been successfully updated.",
            life: 5000,
          });
        },
        onError: (error) => {
          updateToast.current.show({
            severity: "error",
            summary: "Error",
            detail: `There was an error updating the leave request. Please try again. - ${error.message}`,
            life: 5000,
          });
        },
      }
    );
  }

  const leaveTypes = [
    "Casual Leave",
    "Sick Leave",
    "Privilege Leave",
    "Marriage Leave",
    "Maternity Leave",
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid">
        <div className="col-6 pt-6">
          <FloatLabel>
            <Calendar
              inputId="start_date"
              value={new Date(startDate)}
              onChange={(e) => setStartDate(e.value)}
              showIcon
              dateFormat="dd/mm/yy"
              className="w-full"
            />
            <label htmlFor="start_date">Start Date</label>
          </FloatLabel>
        </div>
        <div className="col-6 pt-6">
          <FloatLabel>
            <Calendar
              inputId="end_date"
              value={new Date(endDate)}
              onChange={(e) => setEndDate(e.value)}
              showIcon
              dateFormat="dd/mm/yy"
              className="w-full"
            />
            <label htmlFor="end_date">End Date</label>
          </FloatLabel>
        </div>
        <div className="col-6 pt-6">
          <FloatLabel>
            <Dropdown
              inputId="leave-type"
              value={selectLeaveType}
              onChange={(e) => setSelectLeaveType(e.value)}
              options={leaveTypes}
              optionLabel="name"
              className="w-full"
            />
            <label htmlFor="leave-type">Leave Type</label>
          </FloatLabel>
        </div>
        <div className="col-6 pt-6" style={{ cursor: "not-allowed" }}>
          <InputText
            type="text"
            disabled
            placeholder="Pending"
            className="w-full"
            value={selectStatus}
            style={{
              backgroundColor: "#e5e7eb",
              color: "#9ca3af",
            }}
          />
        </div>
        <div className="col-12 pt-6">
          <FloatLabel>
            <InputTextarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              cols={30}
              className="w-full"
            />
            <label htmlFor="reason">Reason</label>
          </FloatLabel>
        </div>
      </div>
      <Button label="Submit" icon="pi pi-check" loading={isPending} />
    </form>
  );
}

export default UpdateLeaveRequest;
