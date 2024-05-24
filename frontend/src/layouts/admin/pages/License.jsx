import { useState, useEffect } from 'react';
import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function License() {
  const [licenseInfo, setLicenseInfo] = useState({});

  useEffect(() => {
    fetch("http://localhost:8081/admin/getLicenseInfo", {
        method: "GET", // or 'DELETE'
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
    })
      .then(response => response.json())
      .then(data => setLicenseInfo(data))
      .catch(error => console.error('Error:', error));
  }, []);

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className='pl-24 pt-24'>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">License Information</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details.</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{licenseInfo.firstname} {licenseInfo.lastname}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{licenseInfo.email}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">License ID</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{licenseInfo.licenseId}</dd>
          </div>
          
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Issued Date</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{formatDate(licenseInfo.issueDate)}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Expiry Date</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{formatDate(licenseInfo.expiryDate)}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">{licenseInfo.license.split('\\').pop()}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href={`http://localhost:8081/superAdmin/downloadLicense/${licenseInfo.id}`} target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500">
                      View
                    </a>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
