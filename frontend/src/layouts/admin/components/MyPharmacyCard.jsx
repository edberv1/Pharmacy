/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';


function MyPharmacyCard({ id , name, location }) {
  return (
    <Link to={`/admin/myPharmacies/${id}`}> {/* pra qishtu o mir te kqyri a pi qet detajet tash*/} 
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-green-500 mb-6">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{id} . {name}</div>
          <div className="text-gray-700 text-base">{location}</div>
        </div>
      </div>
     </Link>
  );
}
// Add propTypes validation
MyPharmacyCard.propTypes = {
  id: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

export default MyPharmacyCard;
