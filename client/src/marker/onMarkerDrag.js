import logDragEvent from './logDragEvent'

const onMarkerDrag = (event) => {
  logDragEvent("onDrag", event);
};

export default onMarkerDrag;
