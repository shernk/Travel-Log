import * as React from "react";

const ControlPanelViewPort = ({ onSelectCity, entries }) => {
  return (
    <>
      <div id="toggle" className="control-panel viewport">
        <h3>The Marked Locations</h3>
        <hr />

        {entries
          .filter((city) => city.title)
          .map((city, index) => (
            <div key={`btn-${index}`} className="input">
              <input
                type="radio"
                name="city"
                id={`city-${index}`}
                // defaultChecked={city.title === "Da Nang"}
                onClick={() => onSelectCity(city)}
              />
              <label htmlFor={`city-${index}`}>{city.title}</label>
            </div>
          ))}
      </div>
    </>
  );
};

export default React.memo(ControlPanelViewPort);
