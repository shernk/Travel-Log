import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import { listLogEntries } from "./API";
import LogEntryForm from "./logEntryForm";
import ControlPanel from "./marker/control-panel";
import Pin from "./marker/pin";

const App = () => {
  const [logEntry, setLogEntries] = React.useState([]);
  const [showPopUp, setShowPopUp] = React.useState({});
  const [addEntryLocation, setAddEntryLocation] = React.useState(null);
  const [viewport, setViewport] = React.useState({
    width: "100vw",
    height: "100vh",
    latitude: 47.608013,
    longitude: -122.335167,
    zoom: 8,
  });
  const [events, setEvents] = useState("");

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    // console.log(logEntries);
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopUp = (event) => {
    // console.log(event);
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      longitude,
      latitude,
    });
  };

  /**
   * ? onDragStart is not show
   * ? onDragStart & onDrag & onDragEnd are not async to show
   * TODO: set new logEntry info when onGragEnd
   ****idea: 
    1. In onMarkerDragStart, when click set logEntryForm is empty(it mean delete current its entry want to drag)
    2. In onMarkerDragEnd: take lngLat location and show logEntryForm to input new info
   */

  function logDragEvent(name, events) {
    const lngLats = events.lngLat;

    setEvents({
      ...lngLats,
      [name]: lngLats,
    });

    //TODO: set logEntry's info is a new info
    // code here ...
  }

  const onMarkerDragStart = (event) => {
    logDragEvent("onDragStart", event);
  };

  const onMarkerDrag = (event) => {
    logDragEvent("onDrag", event);
  };

  const onMarkerDragEnd = (event) => {
    logDragEvent("onDragEnd", event);

    return {
      marker: {
        longitude: event.lngLat[0],
        latitude: event.lngLat[1],
      },
    };
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopUp}
    >
      {logEntry.map((entry) => (
        <React.Fragment key={entry._id}>
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
              onClick={() =>
                setShowPopUp({
                  [entry._id]: true,
                })
              }
            >
              <Pin />
            </div>
          </Marker>
          {showPopUp[entry._id] ? (
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
              </div>
            </Popup>
          ) : null}
        </React.Fragment>
      ))}

      {addEntryLocation ? (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <div>
              <svg
                className="marker red"
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`,
                }}
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
              >
                <g>
                  <path
                    d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                    c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                    c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"
                  />
                </g>
              </svg>
            </div>
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
      ) : null}

      <ControlPanel names={events} />

      <div className="zoom-control">
        <div className="fullscreenControlStyle">
          <FullscreenControl />
        </div>
        <div className="navStyle">
          <NavigationControl />
        </div>
        <div className="scaleControlStyle">
          <ScaleControl />
        </div>
        <div className="geolocateStyle">
          <GeolocateControl />
        </div>
      </div>
    </ReactMapGL>
  );
};

export default App;
