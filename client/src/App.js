import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import { listLogEntries } from "./API";
import LogEntryForm from "./entry/logEntryForm";
import ControlPanel from "./marker/control-panel";
import Pin from "./marker/pin";

const App = () => {
  const [logEntry, setLogEntries] = useState([]);
  const [showPopUp, setShowPopUp] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [events, setLogEvents] = useState({});
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 47.608013,
    longitude: -122.335167,
    zoom: 8,
  });

  // All location've already existed
  const getEntries = async () => {
    const logEntries = await listLogEntries();
    console.log(logEntries);

    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const onMarkerDragStart = useCallback((event) => {
    setLogEvents((_event) => ({ ..._event, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    setLogEvents((_event) =>  ({ ..._event, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    setLogEvents((_event) => ({ ..._event, onDragEnd: event.lngLat }));
  }, []);

  const showAddMarkerPopUp = (event) => {
    // console.log(event);
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      longitude,
      latitude,
    });
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
      ) : null}

      <ControlPanel lngLats={events} />

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
