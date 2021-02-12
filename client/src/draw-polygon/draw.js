import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { Editor, EditingMode } from "react-map-gl-draw";
import DrawTools from "./draw-tool";
import { getFeatureStyle, getEditHandleStyle } from "./style";

const DrawPolygon = () => {
  const [mode, setMode] = useState(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const editorRef = useRef(null);

  const onSelect = useCallback((options) => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex);
  }, []);

  const onUpdate = useCallback(({ editType }) => {
    if (editType === "addFeature") {
      setMode(new EditingMode());
    }
  }, []);

  // const features = editorRef.current && editorRef.current.getFeatures();

  // measure of length
  // const length =
  //   features &&
  //   (features[selectedFeatureIndex] || features[features.length - 1]);

  return (
    <>
      <Editor
        ref={editorRef}
        style={{ width: "100%", height: "100%" }}
        clickRadius={12}
        mode={mode}
        onSelect={onSelect}
        onUpdate={onUpdate}
        editHandleShape={"circle"}
        featureStyle={getFeatureStyle}
        editHandleStyle={getEditHandleStyle}
      />
      <DrawTools
        selectedFeatureIndex={selectedFeatureIndex}
        editorRef={editorRef}
        setMode={setMode}
      />
    </>
  );
};

export default DrawPolygon;
