import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="outline" size="sm">
        Test
      </Button>,
    );
    const btn = screen.getByText('Test');
    expect(btn.className).toMatch(/outline/);
    expect(btn.className).toMatch(/sm/);
  });

  it('renders as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="#">Link</a>
      </Button>,
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
