import * as React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import { listLogEntries, deleteLogEntry } from "./fetch/API";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "./cluster/layer";
import ControlPanel from "./marker/control-panel";
import ControlZoom from "./zoom-control/controlZoom";
import PopUpLogEntry from "./popup/popUp";
import AddEntryLocation from "./entry/addEntryLocation";
import MarkerLogEntry from "./marker/marker";
import DrawPolygon from "./draw-polygon/draw";

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const App = () => {
  const mapRef = useRef(null);
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
    bearing: 0,
    pitch: 0,
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

  const OnClick = (event) => {
    try {
      const feature = event.features[0];
      const clusterId = feature.properties.cluster_id;

      const mapboxSource = mapRef.current.getMap().getSource("earthquakes");

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        setViewport({
          ...viewport,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          zoom,
          transitionDuration: 500,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopUp}
      interactiveLayerIds={[clusterLayer.id]}
      onClick={OnClick}
      ref={mapRef}
    >
      <Source
        id="earthquakes"
        type="geojson"
        data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>

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

        <DrawPolygon />
      </div>
    </ReactMapGL>
  );
};

export default App;
