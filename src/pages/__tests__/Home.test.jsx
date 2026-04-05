import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import { publicApi } from '../../api/publicApi';

// Mock the API
vi.mock('../../api/publicApi');

const mockWOTD = {
  id: '1',
  word: 'ephemeral',
  phonetic: '/əˈfem(ə)rəl/',
  meanings: [{ part_of_speech: 'adjective', definitions: [{ definition: 'lasting for a very short time.' }] }]
};

describe('Home Page (WOTD & Trending)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially, then displays WOTD', async () => {
    publicApi.getWOTD.mockResolvedValueOnce(mockWOTD);
    publicApi.getTrending.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check loading state
    expect(screen.getByText(/Loading lexicon/i)).toBeInTheDocument();

    // Wait for WOTD to load
    await waitFor(() => {
      expect(screen.getByText('ephemeral')).toBeInTheDocument();
      expect(screen.getByText('lasting for a very short time.')).toBeInTheDocument();
    });
  });
});