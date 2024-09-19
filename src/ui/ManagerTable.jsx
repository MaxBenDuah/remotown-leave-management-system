import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import supabase from "../services/supabase";
import { useSearchParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";

import { useGetEmployee } from "../features/employees/useGetEmployee";
import { useUser } from "../features/users/useUser";
import { useUpdateLeaveRequestByManager } from "../features/employees/useUpdateLeaveRequestByManager";

function ManagerTable({ allLeaveRequest }) {
  const [leaveRequest] = useState(allLeaveRequest);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const { mutate: updateLeaveRequest } = useUpdateLeaveRequestByManager();
  const { user } = useUser();
  const { data: managersData } = useGetEmployee(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(
    function () {
      if (managersData) {
        searchParams.set("employee_id", managersData.id);
        setSearchParams(searchParams);
      }
    },
    [managersData, searchParams, setSearchParams]
  );

  const nameBodyTemplate = (rowData) => {
    return <p className="font-medium text-xl">{rowData.employee_name}</p>;
  };

  function handleUpdate(e, id, employee_id) {
    const value = e.target.value;

    if (!value) return;

    updateLeaveRequest(
      { value, id },
      {
        onSuccess: async () => {
          // Create notification for the employee
          const notificationMessageForEmployee = `Your leave request has been ${value}.`;
          await supabase.from("notifications").insert([
            {
              employee_id,
              leave_request_id: id,
              message: notificationMessageForEmployee,
              is_read: false,
            },
          ]);

          // Create notification for the manager
          const notificationMessageForManager = `You have ${value.toLowerCase()} a leave request.`;
          await supabase.from("notifications").insert([
            {
              employee_id: managersData.id,
              leave_request_id: id,
              message: notificationMessageForManager,
              is_read: false,
            },
          ]);
        },
      }
    );
    searchParams.set("updateId", employee_id);
    setSearchParams(searchParams);
  }

  const exportCSV = () => {
    dt.current.exportCSV();
  };

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

  const statusOptions = ["Pending", "Approved", "Rejected"];

  const statusBodyTemplate = (rowData) => {
    return (
      <Dropdown
        value={rowData.status}
        onChange={(e) => handleUpdate(e, rowData.id, rowData.employee_id)}
        options={statusOptions}
        optionLabel="name"
      />
    );
  };

  const reasonBodyTemplate = (rowData) => {
    return <p className="font-medium">{rowData.comments}</p>;
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

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
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

  return (
    <div className="border-round-3xl overflow-hidden shadow-2 bg-white">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>

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
              value={leaveRequest}
              selection={selectedProducts}
              onSelectionChange={(e) => setSelectedProducts(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} leave requests"
              globalFilter={globalFilter}
              header={header}
              stripedRows
            >
              <Column selectionMode="multiple" exportable={false}></Column>
              <Column
                field="employee_name"
                header="Name"
                body={nameBodyTemplate}
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                field="created_at"
                header="Created At"
                sortable
                dataType="date"
                style={{ minWidth: "12rem" }}
                body={createdAtDateBodyTemplate}
                filterElement={dateFilterTemplate}
              />
              <Column
                field="start_date"
                header="From"
                sortable
                dataType="date"
                style={{ minWidth: "12rem" }}
                body={startDateBodyTemplate}
                filterElement={dateFilterTemplate}
              />
              <Column
                field="end_date"
                header="To"
                sortable
                dataType="date"
                style={{ minWidth: "12rem" }}
                body={endDateBodyTemplate}
                filterElement={dateFilterTemplate}
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
            </DataTable>
          </Dialog>
        ) : (
          <DataTable
            ref={dt}
            value={leaveRequest}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} leave requests"
            globalFilter={globalFilter}
            header={header}
            stripedRows
          >
            <Column selectionMode="multiple" exportable={false}></Column>
            <Column
              field="employee_name"
              header="Name"
              body={nameBodyTemplate}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="created_at"
              header="Created At"
              sortable
              dataType="date"
              style={{ minWidth: "12rem" }}
              body={createdAtDateBodyTemplate}
              filterElement={dateFilterTemplate}
            />
            <Column
              field="start_date"
              header="From"
              sortable
              dataType="date"
              style={{ minWidth: "12rem" }}
              body={startDateBodyTemplate}
              filterElement={dateFilterTemplate}
            />
            <Column
              field="end_date"
              header="To"
              sortable
              dataType="date"
              style={{ minWidth: "12rem" }}
              body={endDateBodyTemplate}
              filterElement={dateFilterTemplate}
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
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default ManagerTable;
