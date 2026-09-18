import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TimerDashboard } from '@/components/timer/TimerDashboard';

describe('timer flow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the dashboard and ready state for a focus session', () => {
    render(<TimerDashboard />);

    expect(screen.getByRole('heading', { name: /work in rhythm/i })).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /start/i })[0]).toBeInTheDocument();
  });

  it('shows a visible lifecycle status', () => {
    render(<TimerDashboard />);

    expect(screen.getByText(/ready/i)).toBeInTheDocument();
  });

  it('applies a custom focus duration immediately and uses it for the next run', () => {
    render(<TimerDashboard />);

    fireEvent.change(screen.getByLabelText(/custom minutes/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/custom seconds/i), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /apply custom duration/i }));

    expect(screen.getByText('10:30')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^start$/i }));

    expect(screen.getByText(/running/i)).toBeInTheDocument();
    expect(screen.getByText('10:30')).toBeInTheDocument();
  });

  it('shows a visible notification when a focus cycle completes', () => {
    vi.useFakeTimers();
    render(<TimerDashboard />);

    fireEvent.change(screen.getByLabelText(/custom minutes/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/custom seconds/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /apply custom duration/i }));
    fireEvent.click(screen.getByRole('button', { name: /^start$/i }));

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(screen.getByText(/focus session complete/i)).toBeInTheDocument();
  });
});
