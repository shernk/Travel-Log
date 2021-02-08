import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import ReactMapGL from "react-map-gl";
import { listLogEntries, deleteLogEntry } from "./fetch/API";
import ControlPanel from "./marker/control-panel";
import ControlZoom from "./zoom-control/controlZoom";
import PopUpLogEntry from "./popup/popUp";
import AddEntryLocation from "./entry/addEntryLocation";
import MarkerLogEntry from "./marker/marker";

const App = () => {
  const [logEntry, setLogEntries] = useState([]);
  const [showPopUp, setShowPopUp] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [events, setLogEvents] = useState({});
  const [title, setGetTitle] = useState("");
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 47.608013,
    longitude: -122.335167,
    zoom: 9,
  });

  // All location've already existed
  const getEntries = async () => {
    const logEntries = await listLogEntries();
    console.log(logEntries);

    setLogEntries(logEntries);
  };

  // render to show all location was marked
  useEffect(() => {
    getEntries();
  }, []);

  const onMarkerDragStart = useCallback((event) => {
    setLogEvents((_event) => ({ ..._event, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    setLogEvents((_event) => ({ ..._event, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    setLogEvents((_event) => ({ ..._event, onDragEnd: event.lngLat }));

    // show logEntry form to create new marker
    showAddMarkerPopUp(event);
  }, []);

  const showAddMarkerPopUp = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      longitude,
      latitude,
    });
  };

  const deleteMarker = async (id) => {
    const logEntries = await listLogEntries();

    // get logEntry by id
    logEntries.filter((entry) => entry._id !== id);

    // async with database
    deleteLogEntry(id);

    // reload marker to front-end
    // async save to database
    await getEntries();
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
          <MarkerLogEntry
            entry={entry}
            onMarkerDragStart={onMarkerDragStart}
            onMarkerDrag={onMarkerDrag}
            onMarkerDragEnd={onMarkerDragEnd}
            setShowPopUp={setShowPopUp}
            setGetTitle={setGetTitle}
          />

          {showPopUp[entry._id] ? (
            <PopUpLogEntry
              entry={entry}
              setShowPopUp={setShowPopUp}
              deleteMarker={deleteMarker}
            />
          ) : null}
        </React.Fragment>
      ))}

      {addEntryLocation ? (
        <AddEntryLocation
          addEntryLocation={addEntryLocation}
          setAddEntryLocation={setAddEntryLocation}
          getEntries={getEntries}
        />
      ) : null}

      <div className="control-zoom-panel">
        <ControlPanel
          lngLats={events}
          title={title}
          viewport={setViewport}
          entries={logEntry}
        />
        <ControlZoom />
      </div>
    </ReactMapGL>
  );
};

export default App;
