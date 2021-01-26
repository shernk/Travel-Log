import {useState} from 'react';

const ShowAddMarkerPopUp = (event) => {  
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  // console.log(event);
  const [longitude, latitude] = event.lngLat;
  
  return setAddEntryLocation({
    longitude,
    latitude,
  });
};

export default ShowAddMarkerPopUp