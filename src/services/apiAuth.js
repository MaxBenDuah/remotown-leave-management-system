import supabase, { supabaseUrl } from "./supabase";

export async function signUpUser({ email, password, role, name, department }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        department,
        role,
        avatar: "",
      },
    },
  });

  if (error) {
    throw new Error(
      `Something went wrong whiles signing you up - ${error.message}`
    );
  } else {
    // If sign-up is successful, insert the user details into the employees table
    const { error: insertError } = await supabase
      .from("employees")
      .insert([{ email, role, name, department }]);

    if (insertError) {
      throw new Error(
        `Error inserting into employees table - ${insertError.message}`
      );
    }
  }

  return data;
}

export async function loginUser({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    throw new Error(`There was a problem logging you in - ${error.message}`);

  return data;
}

export async function getCurrentUserSession() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

export async function userLogout() {
  let { error } = await supabase.auth.signOut();

  if (error)
    throw new Error(`There was a problem loging out - ${error.message}`);
}

export async function updateCurrentUser({ password, updateName, avatar }) {
  // 1. Update Password OR Name
  let updateData = {};

  if (password) updateData = { password };

  if (updateName) updateData.data = { name: updateName };

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error)
    throw new Error(
      `There was a problem updating the user data - ${error.message}`
    );

  // Step 2: If the user updated their name, also update it in the employees table
  if (updateName) {
    const { error: updateNameError } = await supabase
      .from("employees")
      .update({ name: updateName })
      .eq("email", data.user.email);

    if (updateNameError) {
      throw new Error(
        `There was a problem updating the name in the employees table - ${updateNameError.message}`
      );
    }
  }

  if (!avatar) return data;

  // 2. Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError)
    throw new Error(
      `There was a problem uploading the avatar - ${storageError.message}`
    );

  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  if (error2)
    throw new Error(
      `There was a problem updating the user avatar - ${error2.message}`
    );

  return updatedUser;
}

export async function forgotPassword({ email }) {
  let { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error)
    throw new Error(
      `There was a problem resetting password - ${error.message}`
    );

  return data;
}
