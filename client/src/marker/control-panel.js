import * as React from "react";
import ControlPanelViewPort from "../viewport/viewport";
import { FlyToInterpolator } from "react-map-gl";

const eventNames = ["onDragStart", "onDrag", "onDragEnd"];

function round5(value) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}

const ControlPanel = ({ lngLats, title, viewport, entries }) => {
  const onSelectCity = React.useCallback(
    ({ longitude, latitude }) => {
      viewport({
        longitude,
        latitude,
        zoom: 9,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
        transitionDuration: "auto",
      });
    },
    [viewport]
  );

  return <ControlPanelViewPort onSelectCity={onSelectCity} entries={entries} />;
};

export default React.memo(ControlPanel);
