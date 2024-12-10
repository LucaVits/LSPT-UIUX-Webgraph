import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import WebGraph from "./WebGraph";
import createInfoBox from "./CreateInfoBox";

const GraphPage = (graphJson) => {
  const { name } = useParams();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(graphJson)
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
        datasets.nodes && datasets.edges ? (
          <WebGraph
            datasets={{
              nodes: datasets.nodes.map((node) => ({
                id: node.id.toString(),
                title: `Node ${node.id}`,
                link: `https://${node.url}`,
                size: Math.round(node.page_rank * 100), // Scale size for visualization
                page_rank: node.page_rank,
              })),
              edges: datasets.edges.map((edge) => ({
                source: edge.source.toString(),
                target: edge.target.toString(),
              })),
            }}
            renderInfoBox={(node) =>
              createInfoBox(
                node.title,
                `${node.link}`,
                `This is node ${node.title}, which has a page rank of ${node.page_rank}.`
              )
            }
            width={800}
            height={600}
          />
        ) : (
          <p>No data found for this graph.</p>
        )
      )}
    </div>
  );
  
};

export default GraphPage;
