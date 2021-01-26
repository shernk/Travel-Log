function round5(value) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}

const ControlPanel = ({lngLats}) => {
  const eventNames = ["onDragStart", "onDrag", "onDragEnd"];

  const renderEvent = (eventName) => {
    const location = lngLats;
    const lngLat = location[eventName];

    return (
      <div key={eventName}>
        <strong>{eventName}:</strong>{" "}
        {lngLat ? (
          lngLat.map(round5).join(", ")
        ) : (
          <em>            
            null
          </em>
        )}
      </div>
    );
  }

  return (
    <div className="control-panel">
      <h3>
        Draggable Marker
      </h3>
      <div>{eventNames.map(renderEvent)}</div>
    </div>
  );
};

export default ControlPanel;
