/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useContext } from 'react';
import { AlertContext } from '../../../contexts/AlertContext';
import Alert from "../components/Alert"

export default function ProfileAdmin() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showAlert, message, type } = useContext(AlertContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/admin/getUserProfile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
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

  const handleChangeProfile = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(
        "http://localhost:8081/admin/updateUserProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify({
            firstName,
            lastName,
            userId, // Include userId here
          }),
        }
      );
  
      showAlert("Profile updated successfully", "success");
    } catch (error) {
      showAlert("Error updating profile", "error");
    }
  };
  

  const changePassword = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
  
    // Check if new password and confirm password are the same
    if (newPassword !== confirmPassword) {
      showAlert("New password and confirm password do not match", "error");
      return;
    }
  
    try {
      const response = await fetch(
        "http://localhost:8081/admin/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );
  
      const data = await response.json();
      if (!response.ok) {
        showAlert(data.message, "error"); // Show the error message from the server
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        showAlert("Password updated successfully", "success"); // Show success message
      }
    } catch (error) {
      showAlert("Error updating password", "error");
    }
  };
  

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  };
  return (
    <div className="container mx-auto  max-w-6xl">
     <Alert message={message} type={type} />
      <form onSubmit={handleChangeProfile}>
        <h2 className="text-base  font-semibold leading-7 text-gray-900">
          Personal Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Your personal information.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 w-1/2">
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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 w-1/2 ">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Change information
          </button>
        </div>
      </form>
      <form action="">
        <div className="sm:col-span-4 pb-12 w-1/2">
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

        <div className="sm:col-span-4  pb-12 w-1/2">
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

        <div className="sm:col-span-4  border-b border-gray-900/10 pb-12 w-1/2">
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="confirm-password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6 w-1/2">
          <button
            type="button"
            onClick={handleCancel} // Add this line
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>

          <button
            id="change-password-button"
            type="submit"
            onClick={changePassword}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Change Password
          </button>

        </div>
      </form>
    </div>
  );
}
