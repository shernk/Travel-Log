import { Marker } from "react-map-gl";
import Pin from "./pin";

const MarkerLogEntry = ({
  entry,
  onMarkerDragStart,
  onMarkerDrag,
  onMarkerDragEnd,
  setShowPopUp,
  setGetTitle,
}) => {
  return (
    <Marker
      latitude={entry.latitude}
      longitude={entry.longitude}
      offsetTop={-20}
      offsetLeft={-10}
      draggable
      onDragStart={onMarkerDragStart}
      onDrag={onMarkerDrag}
      onDragEnd={onMarkerDragEnd}
    >
      <div
        className="pin"
        onClick={() => {
          setShowPopUp({ [entry._id]: true });
          setGetTitle(entry.title);
        }}
      >
        <Pin />
      </div>
    </Marker>
  );
};

export default MarkerLogEntry