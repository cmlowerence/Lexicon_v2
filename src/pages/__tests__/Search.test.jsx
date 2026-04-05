import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Search from '../Search';

const mockUseSearchQuery = vi.fn();
const mockRefetch = vi.fn();

vi.mock('../../hooks/useLexiconQueries', () => ({
  useSearchQuery: (params) => mockUseSearchQuery(params),
}));

describe('Search Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchQuery.mockImplementation(({ query, isSemantic, enabled }) => {
      if (!enabled) {
        return {
          data: undefined,
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: mockRefetch,
        };
      }

      if (query === 'resilience' && !isSemantic) {
        return {
          data: [{
            id: '2',
            word: 'resilience',
            meanings: [{ part_of_speech: 'noun', definitions: [{ definition: 'the capacity to recover quickly from difficulties.' }] }],
          }],
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: mockRefetch,
        };
      }

      return {
        data: [],
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      };
    });
  });

  it('passes normalized search state into useSearchQuery and renders results', async () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(/Search for a word/i);
    await userEvent.type(input, 'resilience');

    await waitFor(() => {
      expect(mockUseSearchQuery).toHaveBeenLastCalledWith({
        query: 'resilience',
        isSemantic: false,
        language: 'en',
        enabled: true,
      });
      expect(screen.getByText('resilience')).toBeInTheDocument();
    });
  });

  it('updates semantic mode in query params and allows manual refetch', async () => {
    render(<Search />);

    const semanticToggle = screen.getByRole('checkbox', { hidden: true });
    const input = screen.getByPlaceholderText(/Search for a word/i);
    const searchButton = screen.getByText(/Search/i, { selector: 'button' });

    await userEvent.click(semanticToggle);
    await userEvent.type(input, 'happy');

    await waitFor(() => {
      expect(mockUseSearchQuery).toHaveBeenLastCalledWith({
        query: 'happy',
        isSemantic: true,
        language: 'en',
        enabled: true,
      });
    }, { timeout: 1000 });

    fireEvent.click(searchButton);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('does not enable search for one-character input', async () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(/Search for a word/i);
    await userEvent.type(input, 'a');

    await waitFor(() => {
      expect(mockUseSearchQuery).toHaveBeenLastCalledWith({
        query: 'a',
        isSemantic: false,
        language: 'en',
        enabled: false,
      });
      expect(screen.getByText(/Start typing at least 2 characters/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
