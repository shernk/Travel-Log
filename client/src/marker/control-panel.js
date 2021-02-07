import * as React from "react";
import ControlPanelViewPort from "../viewport/viewport";
import { FlyToInterpolator } from "react-map-gl";

const eventNames = ["onDragStart", "onDrag", "onDragEnd"];

function round5(value) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}

const ControlPanel = ({ lngLats, title, viewport, entries }) => {
  const onSelectCity = React.useCallback(({ longitude, latitude }) => {
    viewport({
      longitude,
      latitude,
      zoom: 9,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
      transitionDuration: "auto",
    });
  }, [viewport]);

  return (
    <>
      <div className="control-panel">
        <h3>
          Draggable Marker:
          <span className="title">{title}</span>
        </h3>
        <div>
          {eventNames.map((eventName) => {
            const location = lngLats;
            const lngLat = location[eventName];

            return (
              <div key={eventName}>
                <strong>{eventName}:</strong>{" "}
                {lngLat ? lngLat.map(round5).join(", ") : <em>null</em>}
              </div>
            );
          })}
        </div>
      </div>
      <ControlPanelViewPort onSelectCity={onSelectCity} entries={entries} />
    </>
  );
};

export default React.memo(ControlPanel);
