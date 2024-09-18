import { useState } from "react";
import { useCreateNewLeaveRequest } from "../features/employees/useCreateNewLeaveRequest";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { FloatLabel } from "primereact/floatlabel";

function DialogPopup({ setVisible, visible, data, toast }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectLeaveType, setSelectLeaveType] = useState("Casual Leave");
  const [selectStatus] = useState("Pending"); //I don't need the setSelectStatus
  const [reason, setReason] = useState("");
  const { mutate: createNewLeaveRequest, isPending } =
    useCreateNewLeaveRequest();

  const leaveTypes = [
    "Casual Leave",
    "Sick Leave",
    "Privilege Leave",
    "Marriage Leave",
    "Maternity Leave",
  ];

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        type="submit"
        onClick={handleSubmit}
        autoFocus
      />
    </div>
  );

  function handleSubmit(e) {
    e.preventDefault();

    createNewLeaveRequest(
      {
        employee_id: data.id,
        leave_type: selectLeaveType,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        status: selectStatus,
        comments: reason,
      },
      {
        onSuccess: () => {
          if (toast && toast.current) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Leave request created successfully!",
              life: 5000,
            });
          }
          setVisible(false);
        },
        // onError we get access to the error object which is the same as the error object we get from useCreateNewLeaveRequest() so it's better to use it here in a toast
        onError: (error) => {
          if (toast && toast.current) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: `Failed to create leave request. Please try again. - ${error.message}`,
              life: 5000,
            });
          }
          setVisible(false);
        },
      }
    );
  }

  if (isPending)
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 z-5 flex align-items-center justify-content-center">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black-alpha-80 opacity-50 z-0"></div>
        <div className="relative z-10">
          <ProgressSpinner />
        </div>
      </div>
    );

  return (
    <>
      <Dialog
        visible={visible}
        style={{ width: "40vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        header="New Leave Request"
        maximizable
        footer={footerContent}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="col-6 pt-6">
              <FloatLabel>
                <Calendar
                  inputId="start_date"
                  value={startDate}
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
                  value={endDate}
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
        </form>
      </Dialog>
    </>
  );
}

export default DialogPopup;
