import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Search from '../Search';
import { publicApi } from '../../api/publicApi';

vi.mock('../../api/publicApi');

describe('Search Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('performs a standard search and renders results', async () => {
    const mockResults = [{
      id: '2',
      word: 'resilience',
      meanings: [{ part_of_speech: 'noun', definitions: [{ definition: 'the capacity to recover quickly from difficulties.' }] }]
    }];
    
    publicApi.searchWord.mockResolvedValueOnce(mockResults);

    render(<Search />);

    const input = screen.getByPlaceholderText(/Search for a word/i);
    const searchButton = screen.getByText(/Search/i, { selector: 'button' });

    // Type query
    await userEvent.type(input, 'resilience');
    fireEvent.click(searchButton);

    // Wait for results
    await waitFor(() => {
      expect(publicApi.searchWord).toHaveBeenCalledWith(
        'resilience',
        false,
        'en',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(screen.getByText('resilience')).toBeInTheDocument();
    });
  });

  it('toggles semantic search flag correctly', async () => {
    publicApi.searchWord.mockResolvedValueOnce([]);

    render(<Search />);
    
    const semanticToggle = screen.getByRole('checkbox', { hidden: true });
    const input = screen.getByPlaceholderText(/Search for a word/i);
    
    // Check semantic toggle
    await userEvent.click(semanticToggle);
    await userEvent.type(input, 'happy');
    
    // Wait for the 400ms debounce to trigger the auto-search
    await waitFor(() => {
      expect(publicApi.searchWord).toHaveBeenCalledWith(
        'happy',
        true,
        'en',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    }, { timeout: 1000 });
  });

  it('does not search for one-character input', async () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(/Search for a word/i);
    await userEvent.type(input, 'a');

    await waitFor(() => {
      expect(publicApi.searchWord).not.toHaveBeenCalled();
    }, { timeout: 700 });
  });
});
