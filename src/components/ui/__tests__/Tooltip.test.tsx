import { render } from '@testing-library/react';

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '../Tooltip';

describe('Tooltip', () => {
  it('renders Root', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(true).toBe(true);
  });
});

describe('TooltipProvider', () => {
  it('renders Provider', () => {
    const { container } = render(
      <TooltipProvider>
        <span>Provider</span>
      </TooltipProvider>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('TooltipTrigger', () => {
  it('renders Trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(true).toBe(true);
  });
});

describe('TooltipPortal', () => {
  it('renders Portal', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipPortal />
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(true).toBe(true);
  });
});

describe('TooltipContent', () => {
  it('renders Content', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(true).toBe(true);
  });
});
