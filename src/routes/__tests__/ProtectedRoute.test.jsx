import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProtectedRoute, { AdminRoute } from '../ProtectedRoute';
import { useAuthStore } from '../../store/authStore';

function LocationProbe() {
  const location = useLocation();
  return (
    <div>
      <p data-testid="pathname">{location.pathname}</p>
      <p data-testid="from">{location.state?.from ?? ''}</p>
    </div>
  );
}

afterEach(() => {
  useAuthStore.getState().forceLogout();
  useAuthStore.setState({ hasHydrated: true });
});

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login with from path', () => {
    useAuthStore.setState({ hasHydrated: true, isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/practice?deck=1#due']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/practice" element={<div>Protected page</div>} />
          </Route>
          <Route path="/login" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('pathname')).toHaveTextContent('/login');
    expect(screen.getByTestId('from')).toHaveTextContent('/practice?deck=1#due');
  });
});

describe('AdminRoute', () => {
  it('redirects unauthenticated users to login with from admin path', () => {
    useAuthStore.setState({ hasHydrated: true, isAuthenticated: false, isAdmin: false });

    render(
      <MemoryRouter initialEntries={['/admin/words?page=3#top']}>
        <Routes>
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="words" element={<div>Admin words</div>} />
          </Route>
          <Route path="/login" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('pathname')).toHaveTextContent('/login');
    expect(screen.getByTestId('from')).toHaveTextContent('/admin/words?page=3#top');
  });
});
