import { NavigationControl, FullscreenControl } from "react-map-gl";

const ControlZoom = () => {
  return (
    <div className="zoom-control right">
      <div className="fullscreenControlStyle">
        <FullscreenControl />
      </div>
      <div className="navStyle">
        <NavigationControl />
      </div>
    </div>
  );
};

export default ControlZoom;
