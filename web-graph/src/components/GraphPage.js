import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import WebGraph from "./WebGraph";
import createInfoBox from "./CreateInfoBox";

const GraphPage = () => {
  const { name } = useParams();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/json/graphs/${name}.json`)
      .then((response) => response.json())
      .then((data) => {
        const mergedData = Array.isArray(data)
          ? {
              nodes: data.flatMap(graph => graph.nodes || []),
              edges: data.flatMap(graph => graph.edges || [])
            }
          : data;
        setDataset(mergedData);
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
      ) : dataset && dataset.nodes && dataset.edges ? (
        <WebGraph
          datasets={dataset}
          renderInfoBox={(node) =>
            createInfoBox(
              node.title,
              `${node.link}`,
              `This is node ${node.title}, which has the color ${node.color}.`
            )
          }
          width={800}
          height={400}
        />
      ) : (
        <p>No data found for this graph.</p>
      )}
    </div>
  );
};

export default GraphPage;
