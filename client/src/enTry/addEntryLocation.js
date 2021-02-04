import { Marker, Popup } from "react-map-gl";
import Pin from "../marker/pin";
import LogEntryForm from "./logEntryForm";

const AddEntryLocation = ({
  addEntryLocation,
  setAddEntryLocation,
  getEntries,
}) => {
  return (
    <>
      <Marker
        latitude={addEntryLocation.latitude}
        longitude={addEntryLocation.longitude}
        offsetTop={-20}
        offsetLeft={-10}
      >
        <Pin />
      </Marker>
      
      <Popup
        latitude={addEntryLocation.latitude}
        longitude={addEntryLocation.longitude}
        closeButton={true}
        closeOnClick={false}
        dynamicPosition={true}
        anchor="top"
        onClose={() => setAddEntryLocation(null)}
      >
        <div className="popup">
          <LogEntryForm
            location={addEntryLocation}
            onClose={() => {
              setAddEntryLocation(null); // after created entry, hidden the form
              getEntries(); // next, reload location was marked
            }}
          />
        </div>
      </Popup>
    </>
  );
};

export default AddEntryLocation;
