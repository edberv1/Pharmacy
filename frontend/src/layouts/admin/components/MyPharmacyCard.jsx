import PropTypes from 'prop-types'; 
import { Link } from 'react-router-dom';
import defaultImage from '../assests/pharmacydemo.jpg' // Import your default image

function MyPharmacyCard({ id, name, location, street, imageUrl}) {
  return (
    <Link to={`/admin/myPharmacies/${id}`}>
      <div className="max-w-sm mb-9 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <span>
          {/* Conditional rendering for imageUrl */}
          {imageUrl ? (
            <img className="rounded-t-lg" src={imageUrl} alt={name} />
          ) : (
            <img className="rounded-t-lg" src={defaultImage} alt="Default Image" />
          )}
        </span>
        <div className="p-5">
          <span>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
          </span>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{location}</p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{street}</p>
          <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            See Details
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

MyPharmacyCard.propTypes = {
  id: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  street:PropTypes.string.isRequired,
  imageUrl: PropTypes.string, // imageUrl is not required anymore since we have a default image
};

export default MyPharmacyCard;
