import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

const mockUseWotdQuery = vi.fn();
const mockUseTrendingQuery = vi.fn();

vi.mock('../../hooks/useLexiconQueries', () => ({
  useWotdQuery: () => mockUseWotdQuery(),
  useTrendingQuery: () => mockUseTrendingQuery(),
}));

const mockWOTD = {
  id: '1',
  word: 'ephemeral',
  phonetic: '/əˈfem(ə)rəl/',
  meanings: [{ part_of_speech: 'adjective', definitions: [{ definition: 'lasting for a very short time.' }] }],
};

describe('Home Page (WOTD & Trending)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWotdQuery.mockReturnValue({
      data: { word: mockWOTD, date: '2026-04-05' },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: vi.fn(),
    });
    mockUseTrendingQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: vi.fn(),
    });
  });

  it('renders WOTD from query hooks and empty trending fallback', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /Word of the Day/i })).toBeInTheDocument();
    expect(screen.getByText('ephemeral')).toBeInTheDocument();
    expect(screen.getByText('lasting for a very short time.')).toBeInTheDocument();
    expect(screen.getByText(/No trending words yet/i)).toBeInTheDocument();
  });
});
