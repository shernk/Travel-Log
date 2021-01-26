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
import onMarkerDragStart from './marker/onMarkerDragStart'
import onMarkerDrag from './marker/onMarkerDrag';
import onMarkerDragEnd from './marker/onMarkerDragEnd'
// import ShowAddMarkerPopUp from './popup/showAddMarkerPopUp'
// import GetEntries from './enTry/getEntries';

const App = () => {
  const [logEntry, setLogEntries] = useState([]);
  const [showPopUp, setShowPopUp] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 47.608013,
    longitude: -122.335167,
    zoom: 8,
  });

  const [events, setEvents] = useState("");

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    console.log(logEntries);
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  function logDragEvent(name, events) {
    const lngLats = events.lngLat;

    return setEvents({
      ...lngLats,
      [name]: lngLats,
    });
  };

  const onMarkerDragStart = (event) => {
    logDragEvent("onDragStart", event);
  };

  const onMarkerDrag = (event) => {
    logDragEvent("onDrag", event);
  };

  const onMarkerDragEnd = async (event) => {
    const longitude = event.lngLat[0];
    const latitude = event.lngLat[1];

    logDragEvent("onDragEnd", event);

    // take the location and show logEntry form
    setAddEntryLocation({
      longitude,
      latitude,
    });

    return {
      marker: {
        longitude,
        latitude,
      },
    };
  };

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
