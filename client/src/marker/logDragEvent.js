const logDragEvent = (name, events) => {
  const lngLats = events.lngLat;

  return({
    ...lngLats,
    [name]: lngLats,
  });
}

export default logDragEvent;
