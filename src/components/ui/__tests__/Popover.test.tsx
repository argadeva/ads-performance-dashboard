import { fireEvent, render } from '@testing-library/react';

import { Popover, PopoverContent, PopoverTrigger } from '../Popover';

describe('Popover', () => {
  it('renders PopoverTrigger', () => {
    const { container } = render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
      </Popover>,
    );
    expect(container.querySelector('[data-slot="popover-trigger"]')).toBeInTheDocument();
  });

  it('renders PopoverContent with custom className and props when open', () => {
    const { getByTestId } = render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent
          className="custom-class"
          data-testid="popover-content"
          align="end"
          sideOffset={10}
        />
      </Popover>,
    );
    const content = getByTestId('popover-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('custom-class');
    expect(content.getAttribute('data-align')).toBe('end');
  });

  it('renders PopoverContent with default props', () => {
    const { getByText } = render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Default Content</PopoverContent>
      </Popover>,
    );
    expect(getByText('Default Content')).toBeInTheDocument();
  });

  it('does not render PopoverContent when closed', () => {
    const { queryByText } = render(
      <Popover open={false}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Should not show</PopoverContent>
      </Popover>,
    );
    expect(queryByText('Should not show')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when trigger is clicked', () => {
    const handleOpenChange = vi.fn();
    const { getByText } = render(
      <Popover onOpenChange={handleOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    fireEvent.click(getByText('Open'));
    expect(handleOpenChange).toHaveBeenCalled();
  });
});
