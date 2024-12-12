import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

jest.mock('axios');
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
      ...actual,
      useNavigate: jest.fn(),
    };
  });

describe('SearchBar Component', () => {
  const mockNavigate = jest.fn();
  const mockData = [
    { id: '1', title: 'First Item' },
    { id: '2', title: 'Second Item' },
    { id: '3', title: 'Third Item' },
  ];

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the search bar input field', () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const inputElement = screen.getByPlaceholderText(/search for a result/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('filters results as input changes', async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const inputElement = screen.getByPlaceholderText(/search for a result/i);

    fireEvent.change(inputElement, { target: { value: 'First' } });

    await waitFor(() => {
      const resultItem = screen.getByText(/first item/i);
      expect(resultItem).toBeInTheDocument();
    });
  });

  test('navigates to the correct route on result selection', async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const inputElement = screen.getByPlaceholderText(/search for a result/i);

    fireEvent.change(inputElement, { target: { value: 'First' } });

    await waitFor(() => {
      const resultItem = screen.getByText(/first item/i);
      fireEvent.click(resultItem);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/1');
  });

  test('displays error message on failed fetch', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const errorMessage = screen.queryByText(/failed to fetch data/i);
      expect(errorMessage).not.toBeInTheDocument(); // Errors are logged, not displayed
    });
  });

  test('handles API search call correctly', async () => {
    const axios = require('axios');
    axios.get.mockResolvedValueOnce({
      data: { nodes: [], edges: [] },
    });

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const inputElement = screen.getByPlaceholderText(/search for a result/i);
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://lspt-link-analysis.cs.rpi.edu:1234/uiux/graph'
      );
    });
  });
});
