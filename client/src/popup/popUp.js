import { Popup } from "react-map-gl";

const PopUpLogEntry = ({ entry, setShowPopUp, deleteMarker }) => {
  return (
    <Popup
      latitude={entry.latitude}
      longitude={entry.longitude}
      closeButton={true}
      closeOnClick={false}
      dynamicPosition={true}
      anchor="top"
      onClose={() => setShowPopUp({})}
    >
      <div className="popup">
        <h3>{entry.title}</h3>
        <p>{entry.comments}</p>
        <p htmlFor="latitude">Latitude: {entry.latitude}</p>
        <p htmlFor="longitude">Longitude: {entry.longitude}</p>
        <small>
          Visited on: {new Date(entry.visitDate).toLocaleDateString()}
        </small>
        {entry.image && <img src={entry.image} alt={entry.title} />}
        <div>
          <button
            className="delete-entry button-entry"
            onClick={() => deleteMarker(entry._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default PopUpLogEntry;
