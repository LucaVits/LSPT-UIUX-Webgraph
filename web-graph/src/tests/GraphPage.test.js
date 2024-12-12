import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import GraphPage from '../components/GraphPage';

describe('GraphPage', () => {
  
  test('displays loading message initially', () => {
    render(
      <MemoryRouter initialEntries={["/graph/test"]}>
        <Route path="/graph/:name">
          <GraphPage />
        </Route>
      </MemoryRouter>
    );
    const loadingElement = screen.getByText(/loading data.../i);
    expect(loadingElement).toBeInTheDocument();
  });
  
  test('displays error message when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch failed')));
    
    render(
      <MemoryRouter initialEntries={["/graph/test"]}>
        <Route path="/graph/:name">
          <GraphPage />
        </Route>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const errorMessage = screen.getByText(/no data found for this graph/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
  
  test('fetches and renders graph data correctly', async () => {
    const mockData = {
      nodes: [{ title: 'Node1', link: 'https://example.com', color: 'red' }],
      edges: [{ from: 'Node1', to: 'Node2' }]
    };
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(mockData) }));
    
    render(
      <MemoryRouter initialEntries={["/graph/test"]}>
        <Route path="/graph/:name">
          <GraphPage />
        </Route>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const nodeElement = screen.getByText(/node1/i);
      expect(nodeElement).toBeInTheDocument();
    });
  });
  
  test('displays the WebGraph component when data is available', async () => {
    const mockData = {
      nodes: [{ title: 'Node1', link: 'https://example.com', color: 'red' }],
      edges: [{ from: 'Node1', to: 'Node2' }]
    };
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(mockData) }));
    
    render(
      <MemoryRouter initialEntries={["/graph/test"]}>
        <Route path="/graph/:name">
          <GraphPage />
        </Route>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const webGraphElement = screen.getByText(/this is node node1, which has the color red./i);
      expect(webGraphElement).toBeInTheDocument();
    });
  });
  
  test('applies delay before setting dataset', async () => {
    const mockData = {
      nodes: [{ title: 'Node1', link: 'https://example.com', color: 'red' }],
      edges: [{ from: 'Node1', to: 'Node2' }]
    };
    jest.useFakeTimers();
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(mockData) }));
    
    render(
      <MemoryRouter initialEntries={["/graph/test"]}>
        <Route path="/graph/:name">
          <GraphPage />
        </Route>
      </MemoryRouter>
    );
    

    //TODO, once tested with link analysis, maybe reduce timer to lower the amount
    jest.advanceTimersByTime(1999); // Not enough to trigger the dataset update
    const loadingElement = screen.queryByText(/loading data.../i);
    expect(loadingElement).toBeInTheDocument();
    
    jest.advanceTimersByTime(1); // Complete the 2000ms delay
    await waitFor(() => {
      const nodeElement = screen.getByText(/node1/i);
      expect(nodeElement).toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
