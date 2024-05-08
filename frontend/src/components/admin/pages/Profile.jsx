import { useState, useEffect } from "react";

export default function ProfileAdmin() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8081/admin/getUserProfile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFirstName(data[0].firstname); // Access the first element of the array
        setLastName(data[0].lastname); // Access the first element of the array
        setEmail(data[0].email); // Access the first element of the array
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this effect runs once on mount

  const updateUserProfile = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8081/admin/updateUserProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8081/admin/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Password changed successfully!');
    } catch (error) {
      console.error("Error changing password: ", error);
    }
  };

  return (
    <form className="" onSubmit={updateUserProfile}>
      <h2 className="text-base  font-semibold leading-7 text-gray-900">
        Personal Information
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Your personal information.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10">
        <div className="sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            First name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="first-name"
              id="first-name"
              value={firstName} // Set value to firstName
              onChange={(e) => setFirstName(e.target.value)} // Update state when input changes
              autoComplete="given-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="last-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Last name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="last-name"
              id="last-name"
              value={lastName} // Set value to firstName
              onChange={(e) => setLastName(e.target.value)} // Update state when input changes
              autoComplete="family-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-4  pb-12">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              readOnly
              value={email} // Set value to firstName
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="sm:col-span-4 pb-12">
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Current Password:
        </label>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="password"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="sm:col-span-4  pb-12">
        <label
          htmlFor="new-password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          New Password:
        </label>
        <div className="mt-2">
          <input
            id="new-password"
            name="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="sm:col-span-4  border-b border-gray-900/10 pb-12">
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Confirm New Password:
        </label>
        <div className="mt-2">
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="confirm-password"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={changePassword}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Change Password
        </button>
      </div>
    </form>
  );
}
