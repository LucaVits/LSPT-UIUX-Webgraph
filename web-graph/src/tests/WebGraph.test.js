import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WebGraph from '../components/WebGraph';
import * as d3 from 'd3';

describe('WebGraph Component', () => {
  
  const mockDatasets = {
    nodes: [
      { id: '1', title: 'Node1', size: 10, page_rank: 0.2 },
      { id: '2', title: 'Node2', size: 15, page_rank: 0.6 },
    ],
    edges: [
      { source: '1', target: '2' }
    ]
  };

  const renderInfoBox = (node) => <div data-testid="info-box">Info for {node.title}</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(d3, 'select').mockImplementation(() => ({
      attr: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
      data: jest.fn().mockReturnThis(),
      join: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      call: jest.fn().mockReturnThis(),
      append: jest.fn().mockReturnThis(),
      style: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis()
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crashing', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    const svgElement = screen.getByRole('img', { hidden: true });
    expect(svgElement).toBeInTheDocument();
  });

  test('renders nodes and links based on datasets', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    expect(d3.select().selectAll).toHaveBeenCalledWith('.node');
    expect(d3.select().selectAll).toHaveBeenCalledWith('.link');
  });

  test('interpolates color based on page_rank', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    const webGraphInstance = new WebGraph({});
    const color1 = webGraphInstance.interpolateColor(0.2);
    const color2 = webGraphInstance.interpolateColor(0.6);
    const color3 = webGraphInstance.interpolateColor(1.0);

    expect(color1).toMatch(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/);
    expect(color2).toMatch(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/);
    expect(color3).toMatch(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/);
  });

  test('renders labels for nodes', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    expect(d3.select().selectAll).toHaveBeenCalledWith('.label');
  });

  test('clicking on a node displays the info box', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    const nodeElement = screen.getByText(/Node1/i);
    fireEvent.click(nodeElement);
    
    const infoBox = screen.getByTestId('info-box');
    expect(infoBox).toBeInTheDocument();
    expect(infoBox).toHaveTextContent('Info for Node1');
  });

  test('dragging a node updates its position', async () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    const nodeElement = screen.getByText(/Node1/i);
    fireEvent.mouseDown(nodeElement, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(nodeElement, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(nodeElement);
    
    await waitFor(() => {
      expect(d3.select().call).toHaveBeenCalled();
    });
  });

  test('applies force simulation with boundary constraints', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    expect(d3.select().call).toHaveBeenCalled();
    expect(d3.select().attr).toHaveBeenCalledWith('viewBox', [0, 0, 800, 600]);
  });

  test('renders custom info box when a node is clicked', async () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    const nodeElement = screen.getByText(/Node1/i);
    fireEvent.click(nodeElement);
    
    const infoBox = screen.getByTestId('info-box');
    expect(infoBox).toBeInTheDocument();
    expect(infoBox).toHaveTextContent('Info for Node1');
  });

  test('displays a boundary for nodes', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    const boundaryForce = d3.select().call.mock.calls[0][0];
    expect(boundaryForce).toBeInstanceOf(Function);
  });

  test('re-renders when datasets prop changes', async () => {
    const { rerender } = render(
      <WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />
    );

    const newDatasets = {
      nodes: [
        { id: '3', title: 'Node3', size: 20, page_rank: 0.9 }
      ],
      edges: []
    };

    rerender(<WebGraph datasets={newDatasets} renderInfoBox={renderInfoBox} />);
    
    await waitFor(() => {
      expect(d3.select().data).toHaveBeenCalledWith(newDatasets.nodes);
    });
  });

  test('handles empty datasets gracefully', () => {
    render(<WebGraph datasets={{}} renderInfoBox={renderInfoBox} />);
    
    expect(d3.select().data).not.toHaveBeenCalledWith(expect.any(Array));
  });

  test('ensures unique node ids are generated for multiple datasets', () => {
    const datasets = [
      {
        nodes: [{ id: '1', title: 'NodeA' }],
        edges: []
      },
      {
        nodes: [{ id: '1', title: 'NodeB' }],
        edges: []
      }
    ];

    render(<WebGraph datasets={datasets} renderInfoBox={renderInfoBox} />);
    
    const allNodeIds = d3.select().data.mock.calls.flat().map(call => call[0].id);
    const uniqueNodeIds = new Set(allNodeIds);
    expect(uniqueNodeIds.size).toBe(allNodeIds.length);
  });

  test('simulates d3 force with nodes and links', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    expect(d3.forceSimulation).toHaveBeenCalledWith(mockDatasets.nodes);
    expect(d3.forceSimulation().force).toHaveBeenCalledWith(
      'link',
      expect.any(Object)
    );
    expect(d3.forceSimulation().force).toHaveBeenCalledWith(
      'collision',
      expect.any(Object)
    );
    expect(d3.forceSimulation().force).toHaveBeenCalledWith(
      'boundary',
      expect.any(Function)
    );
  });

  test('applies d3 drag behavior to nodes', () => {
    render(<WebGraph datasets={mockDatasets} renderInfoBox={renderInfoBox} />);
    
    expect(d3.drag().on).toHaveBeenCalledWith('start', expect.any(Function));
    expect(d3.drag().on).toHaveBeenCalledWith('drag', expect.any(Function));
    expect(d3.drag().on).toHaveBeenCalledWith('end', expect.any(Function));
  });

  test('renders correct SVG dimensions', () => {
    const customWidth = 1000;
    const customHeight = 700;
    render(<WebGraph datasets={mockDatasets} width={customWidth} height={customHeight} renderInfoBox={renderInfoBox} />);
    
    expect(d3.select().attr).toHaveBeenCalledWith('viewBox', [0, 0, customWidth, customHeight]);
  });
});
