import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { useGetLeaveRequest } from "../features/employees/useGetLeaveRequest";
import { useDeleteLeaveRequest } from "../features/employees/useDeleteLeaveRequest";
import { useSearchParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";

import UpdateLeaveRequest from "../features/employees/UpdateLeaveRequest";

function EmployeeTable({ data, deleteToast, updateToast }) {
  const [allLeaveRequests, setAllLeaveRequests] = useState([]);
  const [leaveDialog, setLeaveDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);
  const {
    data: leaveRequests,
    isLoading,
    isError,
    error,
  } = useGetLeaveRequest(data.id);
  const { mutate: deleteLeaveRequest, isPending } = useDeleteLeaveRequest();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    function () {
      if (leaveRequests) {
        setAllLeaveRequests(leaveRequests);
      }
    },
    [leaveRequests]
  );

  if (isLoading) return <ProgressSpinner />;

  if (isError) return <p>{error.message}</p>;

  if (!leaveRequests.length)
    return (
      <p className="text-center text-xl font-medium">
        Your leave request will appear here.
      </p>
    );

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  // Own function start here
  const openLeaveEditDialog = (leave) => {
    setSelectedLeave(leave);
    setLeaveDialog(true);
  };

  const hideLeaveDialog = () => {
    setLeaveDialog(false);
    setSelectedLeave(null);
  };

  const handleLeaveUpdate = (updatedLeave) => {
    const updatedLeaveRequests = allLeaveRequests.map((leave) =>
      leave.id === updatedLeave.id ? updatedLeave : leave
    );
    setAllLeaveRequests(updatedLeaveRequests);
    setLeaveDialog(false);
  };

  function dialogFooterTemplate() {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setDialogVisible(false)}
      />
    );
  }

  const rightToolbarTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
        <Button
          label="Show"
          icon="pi pi-external-link"
          onClick={() => setDialogVisible(true)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData)}></Tag>;
  };

  function handleDelete(id) {
    confirmDialog({
      message: "Are you sure you want to delete this leave request?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        deleteLeaveRequest(id, {
          onSuccess: () => {
            deleteToast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Leave request has been successfully deleted.",
              life: 3000,
            });
          },
          onError: (error) => {
            deleteToast.current.show({
              severity: "error",
              summary: "Error",
              detail: `An error occurred while deleting the leave request. - ${error.message}`,
              life: 3000,
            });
          },
        });
      },
      reject: () => {
        deleteToast.current.show({
          severity: "warn",
          summary: "Cancelled",
          detail: "Leave request deletion cancelled.",
          life: 3000,
        });
      },
    });
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => {
            openLeaveEditDialog(rowData);
            searchParams.set("editId", rowData.id);
            setSearchParams(searchParams);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => handleDelete(rowData.id)}
          disabled={isPending}
        />
      </React.Fragment>
    );
  };

  const getSeverity = (rowData) => {
    switch (rowData.status) {
      case "Approved":
        return "success";

      case "Pending":
        return "warning";

      case "Rejected":
        return "danger";

      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Leave Request</h4>
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </IconField>
      </div>
    </div>
  );

  function formatDate(value) {
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("de-DE", options).format(new Date(value));
  }

  const createdAtDateBodyTemplate = (rowData) => {
    return formatDate(rowData.created_at);
  };

  const startDateBodyTemplate = (rowData) => {
    return formatDate(rowData.start_date);
  };

  const endDateBodyTemplate = (rowData) => {
    return formatDate(rowData.end_date);
  };

  const reasonBodyTemplate = (rowData) => {
    return <p className="font-medium">{rowData.comments}</p>;
  };

  return (
    <div className="border-round-3xl overflow-hidden shadow-2 bg-white">
      <div className="card">
        <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
        <ConfirmDialog />

        {dialogVisible ? (
          <Dialog
            visible={dialogVisible}
            style={{ width: "75vw" }}
            maximizable
            modal
            contentStyle={{ height: "300px" }}
            onHide={() => setDialogVisible(false)}
            footer={dialogFooterTemplate}
          >
            <DataTable
              ref={dt}
              value={leaveRequests}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} leave requests"
              globalFilter={globalFilter}
              header={header}
            >
              <Column selectionMode="multiple" exportable={false}></Column>
              <Column
                field="created_at"
                header="Created At"
                sortable
                dataType="date"
                style={{ minWidth: "12rem" }}
                body={createdAtDateBodyTemplate}
              />
              <Column
                field="start_date"
                header="From"
                sortable
                dataType="date"
                style={{ minWidth: "12rem" }}
                body={startDateBodyTemplate}
              />
              <Column
                field="end_date"
                header="To"
                sortable
                dataType="date"
                style={{ minWidth: "12rem" }}
                body={endDateBodyTemplate}
              />
              <Column
                field="leave_type"
                header="Leave Type"
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                field="status"
                header="Status"
                body={statusBodyTemplate}
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                field="comments"
                header="Reason"
                sortable
                style={{ minWidth: "12rem" }}
                body={reasonBodyTemplate}
              />
              <Column
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "12rem" }}
              ></Column>
            </DataTable>
          </Dialog>
        ) : (
          <DataTable
            ref={dt}
            value={leaveRequests}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} leave requests"
            globalFilter={globalFilter}
            header={header}
          >
            <Column selectionMode="multiple" exportable={false}></Column>
            <Column
              field="created_at"
              header="Created At"
              sortable
              dataType="date"
              style={{ minWidth: "12rem" }}
              body={createdAtDateBodyTemplate}
            />
            <Column
              field="start_date"
              header="From"
              sortable
              dataType="date"
              style={{ minWidth: "12rem" }}
              body={startDateBodyTemplate}
            />
            <Column
              field="end_date"
              header="To"
              sortable
              dataType="date"
              style={{ minWidth: "12rem" }}
              body={endDateBodyTemplate}
            />
            <Column
              field="leave_type"
              header="Leave Type"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="comments"
              header="Reason"
              sortable
              style={{ minWidth: "12rem" }}
              body={reasonBodyTemplate}
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        )}
      </div>

      <Dialog
        visible={leaveDialog}
        style={{ width: "40vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit Leave Request"
        modal
        className="p-fluid"
        onHide={hideLeaveDialog}
        maximizable
      >
        {selectedLeave && (
          <UpdateLeaveRequest
            leave={selectedLeave}
            setEditId={setSelectedLeave}
            updateToast={updateToast}
            onUpdate={handleLeaveUpdate}
          />
        )}
      </Dialog>
    </div>
  );
}

export default EmployeeTable;
