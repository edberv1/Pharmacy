/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Link } from "react-router-dom";

function PharmacyCard({ id, name, location }) {
  return (
    <div className="max-w-sm p-6 bg-white rounded-lg shadow dark:bg-gray-100 dark:border-gray-700">
      <i className="fa-solid fa-hospital w-7 h-7 text-gray-500 dark:text-gray-900 mb-3"></i>

      <Link to={`/pharmacies/${id}`}>
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-900">
          {name}
        </h5>
      </Link>
      <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
        {location}
      </p>
      <Link
        to={`/pharmacies/${id}`}
        className="inline-flex font-medium items-center p-2 border-2 rounded bg-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white"
      >
        Visit Pharmacy
      </Link>
    </div>
  );
}
// Add propTypes validation
PharmacyCard.propTypes = {
  id: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

export default PharmacyCard;
