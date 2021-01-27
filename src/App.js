import React, { useRef, useEffect } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import QueryTask from "@arcgis/core/tasks/QueryTask";
import Query from "@arcgis/core/tasks/support/Query";

import "./App.css";

function App() {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {

      const peaksUrl =
      "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Prominent_Peaks_US/FeatureServer/0";

      const map = new ArcGISMap({
        basemap: "gray-vector",
      });

      const view = new MapView({
        map,
        container: mapDiv.current,
        extent: {
          spatialReference: {
            wkid: 102100,
          },
          xmax: -13581772,
          xmin: -13584170,
          ymax: 4436367,
          ymin: 4435053,
        },
      });

      const resultsLayer = new GraphicsLayer();

      map.add(resultsLayer);

      const qTask = new QueryTask({
        url: peaksUrl
      });

      const params = new Query({
        returnGeometry: true,
        outFields: ["*"]
      });

      params.where = `PROMINENCE_ft > 1000`;

      qTask.execute(params).then((response) => {
        resultsLayer.addMany(response.features);
        view.goTo(response.features);
      });

    }
  }, []);

  return <div className="mapDiv" ref={mapDiv}></div>;
}

export default App;
