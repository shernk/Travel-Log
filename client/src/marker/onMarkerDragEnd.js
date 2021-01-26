import logDragEvent from './logDragEvent';
import ShowAddMarkerPopUp from '../popup/showAddMarkerPopUp'
import GetEntries from '../entry/getEntries'

const onMarkerDragEnd = async (event) => {
  const longitude = event.lngLat[0];
  const latitude = event.lngLat[1];

  logDragEvent("onDragEnd", event);

  // take the location and show logEntry form
  ShowAddMarkerPopUp.setAddEntryLocation({
    longitude,
    latitude,
  });

  // reload the loction was marked
  GetEntries();

  // return {
  //   marker: {
  //     longitude,
  //     latitude,
  //   },
  // };
};

export default onMarkerDragEnd;
