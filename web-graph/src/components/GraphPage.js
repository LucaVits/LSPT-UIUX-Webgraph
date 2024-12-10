import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import WebGraph from "./WebGraph";
import createInfoBox from "./CreateInfoBox";

const GraphPage = () => {
  const { name } = useParams();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/json/graphs/${name}.json`)
      .then((response) => response.json())
      .then((data) => {
        // Ensure we handle both single object and array of objects
        const graphData = Array.isArray(data) ? data : [data];
        setDatasets(graphData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, [name]);

  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : datasets.length > 0 ? (
        datasets.map((dataset, index) => (
          <WebGraph
            key={index}
            datasets={dataset}
            renderInfoBox={(node) =>
              createInfoBox(
                node.title,
                `${node.link}`,
                `This is node ${node.title}, which has the color ${node.color}.`
              )
            }
            width={800}
            height={600}
          />
        ))
      ) : (
        <p>No data found for this graph.</p>
      )}
    </div>
  );
};

export default GraphPage;
