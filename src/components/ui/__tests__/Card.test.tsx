import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card.className).toContain('custom-class');
  });
});

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom-header">Header content</CardHeader>);
    const header = screen.getByText('Header content');
    expect(header.className).toContain('custom-header');
  });
});

describe('CardTitle', () => {
  it('renders children', () => {
    render(<CardTitle>Title content</CardTitle>);
    expect(screen.getByText('Title content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardTitle className="custom-title">Title content</CardTitle>);
    const title = screen.getByText('Title content');
    expect(title.className).toContain('custom-title');
  });
});

describe('CardDescription', () => {
  it('renders children', () => {
    render(<CardDescription>Description content</CardDescription>);
    expect(screen.getByText('Description content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardDescription className="custom-desc">Description content</CardDescription>);
    const desc = screen.getByText('Description content');
    expect(desc.className).toContain('custom-desc');
  });
});

describe('CardAction', () => {
  it('renders children', () => {
    render(<CardAction>Action content</CardAction>);
    expect(screen.getByText('Action content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardAction className="custom-action">Action content</CardAction>);
    const action = screen.getByText('Action content');
    expect(action.className).toContain('custom-action');
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Content area</CardContent>);
    expect(screen.getByText('Content area')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardContent className="custom-content">Content area</CardContent>);
    const content = screen.getByText('Content area');
    expect(content.className).toContain('custom-content');
  });
});

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardFooter className="custom-footer">Footer content</CardFooter>);
    const footer = screen.getByText('Footer content');
    expect(footer.className).toContain('custom-footer');
  });
});
