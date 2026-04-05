import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Practice from '../Practice';

const mockUsePracticeQuery = vi.fn();

vi.mock('../../hooks/useLexiconQueries', () => ({
  usePracticeQuery: () => mockUsePracticeQuery(),
}));

const mockPracticeList = [
  { id: '1', word: 'ubiquitous' },
  { id: '2', word: 'pragmatic' },
];

describe('Practice Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePracticeQuery.mockReturnValue({
      data: mockPracticeList,
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: vi.fn(),
    });
  });

  it('loads practice words and allows navigation', () => {
    render(<Practice />);

    expect(screen.getByText('ubiquitous')).toBeInTheDocument();

    const nextButton = screen.getByText(/Next Word/i);
    fireEvent.click(nextButton);

    expect(screen.getByText('pragmatic')).toBeInTheDocument();

    fireEvent.click(nextButton);
    expect(screen.getByText(/Practice Complete for Today!/i)).toBeInTheDocument();
  });
});
