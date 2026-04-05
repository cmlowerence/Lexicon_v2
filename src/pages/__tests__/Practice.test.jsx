import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Practice from '../Practice';
import { publicApi } from '../../api/publicApi';

vi.mock('../../api/publicApi');

const mockPracticeList = [
  { id: '1', word: 'ubiquitous' },
  { id: '2', word: 'pragmatic' }
];

describe('Practice Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads practice words and allows navigation', async () => {
    publicApi.getDailyPractice.mockResolvedValueOnce(mockPracticeList);

    render(<Practice />);

    await waitFor(() => {
      expect(screen.getByText('ubiquitous')).toBeInTheDocument();
    });

    const nextButton = screen.getByText(/Next Word/i);
    fireEvent.click(nextButton);

    expect(screen.getByText('pragmatic')).toBeInTheDocument();
    
    // Second click should complete practice
    fireEvent.click(nextButton);
    expect(screen.getByText(/Practice Complete for Today!/i)).toBeInTheDocument();
  });
});