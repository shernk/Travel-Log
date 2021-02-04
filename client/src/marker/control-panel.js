import * as React from "react";

const eventNames = ["onDragStart", "onDrag", "onDragEnd"];

function round5(value) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}

const ControlPanel = ({lngLats, title}) => {
  return (
    <div className="control-panel">
      <h3>Draggable Marker:
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
  );
}

export default React.memo(ControlPanel);
