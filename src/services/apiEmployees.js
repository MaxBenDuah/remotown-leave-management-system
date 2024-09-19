import supabase from "./supabase";

export async function getEmployee(user) {
  let { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("email", user.email)
    .single();

  if (error)
    throw new Error(`Employee data could not be loaded - ${error.message}`);

  return data;
}

// I don't need this function anymore because I don't plan on creating an employee as their details are taken when they sign up. However, i want to upload their image and update employees data, so I will do that below
export async function createEmployee(newEmployee) {
  // this code below does not work now because now i want to update employees when they are signed in
  const { data, error } = await supabase
    .from("employees")
    .insert([newEmployee])
    .select();

  if (error) throw new Error("Employee could not be created");

  return data;
}

export async function createLeaveRequest(leaveRequest) {
  const { employee_id, start_date, end_date } = leaveRequest;

  const { data: existingLeaves, error: overlapError } = await supabase
    .from("leave_request")
    .select("id, start_date, end_date")
    .eq("employee_id", employee_id)
    .or(`and(start_date.lte.${end_date}, end_date.gte.${start_date})`);

  if (overlapError) {
    throw new Error(
      "Error checking for overlapping leave requests: " + overlapError.message
    );
  }

  if (existingLeaves.length > 0) {
    // Overlapping leave found, return an error or handle accordingly
    throw new Error("Your leave request overlaps with an existing leave.");
  }

  // Step 2: Fetch the employee's name using the employee_id
  const { data: employeeData, error: employeeError } = await supabase
    .from("employees")
    .select("name")
    .eq("id", employee_id)
    .single();

  if (employeeError) {
    throw new Error("Error fetching employee name: " + employeeError.message);
  }

  const employee_name = employeeData.name;

  // Step 3: Insert the new leave request with the employee name if no overlap is found
  const { data, error } = await supabase
    .from("leave_request")
    .insert([{ ...leaveRequest, employee_name }])
    .select();

  if (error) throw new Error(`Leave was not created - ${error.message}`);

  // Step 3: Create a notification for the leave request creation
  const employeeNotificationMessage = `New leave request submitted by ${employee_name
    .split(" ")
    .at(0)}`;

  // Insert notification into the notifications table
  const { error: employeeNotificationError } = await supabase
    .from("notifications")
    .insert([
      {
        employee_id,
        leave_request_id: data[0].id,
        message: employeeNotificationMessage,
        is_read: false,
      },
    ]);

  if (employeeNotificationError)
    throw new Error(
      `There was a problem creating this notification - ${employeeNotificationError.message}`
    );

  // Step 5: Fetch the manager
  const { data: managerData, error: managerError } = await supabase
    .from("employees")
    .select("id")
    .eq("role", "Manager");

  if (managerError) {
    throw new Error("Error fetching manager: " + managerError.message);
  }

  // Check if we have any managers
  if (!managerData || managerData.length === 0) {
    throw new Error("No managers found in the system.");
  }

  const allManagerIds = managerData.map((manager) => manager.id);

  // Step 6: Create a notification for the manager
  const managerNotificationMessage = `${employee_name} has submitted a new leave request.`;

  // Loop through all the manager IDs and create a notification for each manager
  const notifications = allManagerIds.map((manager_id) => {
    return {
      employee_id: manager_id,
      leave_request_id: data[0].id,
      message: managerNotificationMessage,
      is_read: false,
    };
  });

  const { error: managerNotificationError } = await supabase
    .from("notifications")
    .insert(notifications);

  if (managerNotificationError)
    throw new Error(
      `There was a problem creating the manager notification - ${managerNotificationError.message}`
    );

  return data;
}

export async function getLeaveRequest(id) {
  let { data, error } = await supabase
    .from("leave_request")
    .select("*")
    .eq("employee_id", id)
    .order("created_at", { ascending: false });

  if (error)
    throw new Error(`Couldn't load your leave request - ${error.message}`);

  return data;
}

export async function deleteLeaveRequest(id) {
  const { error } = await supabase.from("leave_request").delete().eq("id", id);

  if (error)
    throw new Error(`Couldn't delete your leave request - ${error.message}`);
}

export async function updateLeaveRequest(updateObj) {
  const { id } = updateObj;

  const { data, error } = await supabase
    .from("leave_request")
    .update(updateObj)
    .eq("id", id)
    .select();

  if (error)
    throw new Error(`Your leave could not be updated - ${error.message}`);

  return data;
}

export async function fetchLeaveRequestById(id) {
  let { data, error } = await supabase
    .from("leave_request")
    .select("*")
    .eq("id", id)
    .single();

  if (error)
    throw new Error(
      `Could not fetch this particular leave request - ${error.message}`
    );

  return data;
}

export async function fetchCurrentUser(userProfile) {
  const { data: profile, error } = await supabase
    .from("employees")
    .select("*")
    .eq("email", userProfile?.user?.email)
    .single();

  if (error) throw new Error(`This profile does not exist - ${error.message}`);

  return profile;
}

export async function getAllLeaveRequest() {
  let { data, error } = await supabase
    .from("leave_request")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    throw new Error(
      `There was a problem loading leave requests - ${error.message}`
    );

  return data;
}

//This function is to get the employee name
export async function getEmployeeToRenderOnManagerDashboardById(id) {
  let { data, error } = await supabase
    .from("employees")
    .select("name")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Error getting employee data - ${error.message}`);

  return data;
}

export async function updateLeaveRequestByManager(statusAndIdObj) {
  const { id, value: status } = statusAndIdObj;

  // Fetch leave request details
  const { data: leaveRequest, error: leaveError } = await supabase
    .from("leave_request")
    .select("employee_id, start_date, end_date, status")
    .eq("id", id)
    .single();

  if (leaveError)
    throw new Error(
      `There was an error fetching leave request - ${leaveError.message}`
    );

  const {
    status: currentStatus,
    start_date,
    end_date,
    employee_id,
  } = leaveRequest;

  // Update the leave request with the new status
  const { data, error: updateError } = await supabase
    .from("leave_request")
    .update({ status })
    .eq("id", id)
    .select();

  if (updateError) {
    throw new Error(
      `There was a problem updating the request - ${updateError.message}`
    );
  }

  // Only subtract leave balance when the status changes from "Pending" to "Approved"
  if (currentStatus !== "Approved" && status === "Approved") {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Calculate the number of leave days
    const leaveDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    // Fetch the current leave balance of the employee
    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .select("leave_balance")
      .eq("id", employee_id)
      .single();

    if (employeeError) {
      throw new Error(
        `Error fetching employee data - ${employeeError.message}`
      );
    }

    const newLeaveBalance = employeeData.leave_balance - leaveDays;

    // Update the employee's leave balance
    const { error: balanceError } = await supabase
      .from("employees")
      .update({ leave_balance: newLeaveBalance })
      .eq("id", employee_id);

    if (balanceError) {
      throw new Error(`Error updating leave balance - ${balanceError.message}`);
    }
  }

  return data;
}

export async function getNotifications(employee_id) {
  let { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("employee_id", employee_id)
    .order("created_at", { ascending: false });

  if (error)
    throw new Error(
      `There was an eror getting notification - ${error.message}`
    );

  return data;
}

export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select();

  if (error)
    throw new Error(
      `There was an error changing notification status - ${error.message}`
    );

  return data;
}

export async function deleteNotification(id) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);

  if (error)
    throw new Error(
      `There was a problem deleting notification - ${error.message}`
    );
}
