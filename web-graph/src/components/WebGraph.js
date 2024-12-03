import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const WebGraph = ({ datasets, width = 800, height = 600, renderInfoBox }) => {
  const svgRef = useRef();
  const simulationRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const nodesRef = useRef([]);
  const linksRef = useRef([]);

  useEffect(() => {
    if (!nodesRef.current.length || !linksRef.current.length) {
      const mergedNodes = [];
      const mergedEdges = [];
      const graphOffset = 200;

      datasets.forEach((data, index) => {
        const xOffset = (index % 3) * graphOffset;
        const yOffset = Math.floor(index / 3) * graphOffset;

        const nodeMap = new Map();
        data.nodes.forEach(node => {
          const newNode = {
            ...node,
            x: node.x || Math.random() * width + xOffset,
            y: node.y || Math.random() * height + yOffset,
            id: `${index}-${node.id}`
          };
          nodeMap.set(node.id, newNode.id);
          mergedNodes.push(newNode);
        });

        data.edges.forEach(edge => {
          mergedEdges.push({
            source: nodeMap.get(edge.source),
            target: nodeMap.get(edge.target)
          });
        });
      });

      nodesRef.current = mergedNodes;
      linksRef.current = mergedEdges;
    }

    const svg = d3.select(svgRef.current);
    svg.attr("viewBox", [0, 0, width, height]);

    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation(nodesRef.current)
        .force("link", d3.forceLink(linksRef.current).id(d => d.id).distance(100).strength(0.1))
        .force("collision", d3.forceCollide().radius(d => d.size).strength(0.9))
        .force("boundary", boundaryForce(width, height))
        .on("tick", () => {
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

          node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

          labels
            .attr("x", d => d.x)
            .attr("y", d => d.y - 15);

          if (selectedNode) {
            infoLine
              .attr("x1", selectedNode.x)
              .attr("y1", selectedNode.y)
              .attr("x2", width - 200)
              .attr("y2", 20);
          }
        });
    } else {
      simulationRef.current.nodes(nodesRef.current);
      simulationRef.current.force("link").links(linksRef.current);
      simulationRef.current.alpha(0.3).restart();
    }

    const link = svg
      .selectAll(".link")
      .data(linksRef.current)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 1.5);

    const node = svg
      .selectAll(".node")
      .data(nodesRef.current)
      .join("circle")
      .attr("class", "node")
      .attr("r", d => d.size)
      .attr("fill", d => d.color)
      .attr("stroke", d => (selectedNode?.id === d.id ? "black" : "none"))
      .attr("stroke-width", 3)
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
      )
      .on("click", (event, d) => {
        setSelectedNode(d);
      });

    const labels = svg
      .selectAll(".label")
      .data(nodesRef.current)
      .join("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("dy", -15)
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .text(d => d.title);

    const infoLine = svg
      .selectAll(".info-line")
      .data(selectedNode ? [selectedNode] : [])
      .join("line")
      .attr("class", "info-line")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5);

    function boundaryForce(width, height) {
      return function () {
        nodesRef.current.forEach(d => {
          if (d.x < d.size) d.x = d.size;
          if (d.x > width - d.size) d.x = width - d.size;
          if (d.y < d.size) d.y = d.size;
          if (d.y > height - d.size) d.y = height - d.size;
        });
      };
    }

    function dragStarted(event, d) {
      if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulationRef.current.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [datasets, width, height, selectedNode]);

  return (
    <div style={{ position: "relative", width, height }}>
      <svg ref={svgRef} width={width} height={height}></svg>
      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "white",
            border: "1px solid black",
            borderRadius: "5px",
            padding: "10px",
            pointerEvents: "auto",
            zIndex: 10
          }}
        >
          {renderInfoBox(selectedNode)}
        </div>
      )}
    </div>
  );
};

export default WebGraph;
