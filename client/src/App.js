import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import ReactMapGL, {
  Marker,
  Popup,
} from "react-map-gl";
import { listLogEntries, deleteLogEntry } from "./fetch/API";
import LogEntryForm from "./enTry/logEntryForm";
import ControlPanel from "./marker/control-panel";
import ControlZoom from "./zoom-control/control";
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

  // render to show all location was marked
  useEffect(() => { getEntries() },[]);
  
  const onMarkerDragStart = useCallback((event) => {
    setLogEvents((_event) => ({ ..._event, onDragStart: event.lngLat }));
  }, []);
  
  const onMarkerDrag = useCallback((event) => {
    setLogEvents((_event) =>  ({ ..._event, onDrag: event.lngLat }));
  }, []);
  
  const onMarkerDragEnd = useCallback(
    (event) => {
      console.log("onDragEnd");
      setLogEvents((_event) => ({ ..._event, onDragEnd: event.lngLat }));

      // show logEntry form to create new marker
      showAddMarkerPopUp(event);

      // delete marker was dragging
      deleteMarker();
    },
    []
  );

  const showAddMarkerPopUp = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      longitude,
      latitude,
    });
  };
  
  const deleteMarker = async (id) => {
    console.log("deleteMarker");
    const logEntries = await listLogEntries();

    // list of all markers
    // const id = logEntries.map((entry) => entry._id);
    console.log(id);

    // delete marker by id
    logEntries.filter((entry) => entry._id !== id);
    console.log(logEntries);

    // save in listLogEntries
    // deleteLogEntry(logEntries);

    setLogEntries(logEntries);

    // reload all marker
    getEntries();
  }

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
              onClick={() => setShowPopUp({ [entry._id]: true })}
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
                <div>
                  <button className="edit-entry button-entry">Edit</button>
                  <button
                    onClick={() => deleteMarker(entry._id)}
                    className="delete-entry button-entry"
                  >
                    Delete
                  </button> 
                </div>
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

      <div className="control-zoom-panel">
        <ControlPanel lngLats={events} />
        <ControlZoom />
      </div>
    </ReactMapGL>
  );
};

export default App;
