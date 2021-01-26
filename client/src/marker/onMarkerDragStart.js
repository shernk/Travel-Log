import  logDragEvent  from "./logDragEvent";

const onMarkerDragStart = (event) => {
  logDragEvent("onDragStart", event);
};

export default onMarkerDragStart;