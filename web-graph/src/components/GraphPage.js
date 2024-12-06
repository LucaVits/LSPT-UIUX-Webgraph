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
        setDatasets(data);
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
      ) : (
        datasets.length > 0 && (
          <WebGraph
            datasets={datasets}
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
        )
      )}
      {datasets.length === 0 && !loading && <p>No data found for this graph.</p>}
    </div>
  );
};

export default GraphPage;
