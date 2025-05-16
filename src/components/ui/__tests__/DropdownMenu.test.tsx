import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../DropdownMenu';

describe('DropdownMenu', () => {
  it('renders DropdownMenu correctly', () => {
    const { container } = render(
      <DropdownMenu>
        <div>Menu content</div>
      </DropdownMenu>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders DropdownMenuTrigger correctly', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">Trigger</DropdownMenuTrigger>
      </DropdownMenu>,
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
  });

  it('renders DropdownMenuPortal correctly', () => {
    expect(() => {
      render(
        <DropdownMenu>
          <DropdownMenuPortal>
            <div data-testid="portal-child">Portal content</div>
          </DropdownMenuPortal>
        </DropdownMenu>,
      );
    }).not.toThrow();
  });

  it('renders DropdownMenuContent with default props', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent data-testid="content">Content</DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(document.querySelector('[data-testid="content"]')).toBeInTheDocument();
  });

  it('renders DropdownMenuContent with custom className and sideOffset', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent data-testid="content" className="custom-class" sideOffset={10}>
          Content
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const content = document.querySelector('[data-testid="content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('custom-class');
  });

  it('renders DropdownMenuCheckboxItem unchecked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            data-testid="checkbox-item"
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Test Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const checkbox = document.querySelector('[data-testid="checkbox-item"]');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveTextContent('Test Item');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    await user.click(checkbox!);
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it('renders DropdownMenuCheckboxItem checked', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem data-testid="checkbox-item-checked" checked={true}>
            Test Checked Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const checkbox = document.querySelector('[data-testid="checkbox-item-checked"]');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('renders DropdownMenuCheckboxItem with custom className', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            data-testid="checkbox-item-custom"
            className="custom-checkbox-class"
          >
            Custom Class Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const checkbox = document.querySelector('[data-testid="checkbox-item-custom"]');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass('custom-checkbox-class');
  });

  it('renders DropdownMenuRadioGroup and RadioItems correctly', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1" onValueChange={onValueChange}>
            <DropdownMenuRadioItem data-testid="radio-item-1" value="option1">
              Option 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem data-testid="radio-item-2" value="option2">
              Option 2
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const radioItem1 = document.querySelector('[data-testid="radio-item-1"]');
    const radioItem2 = document.querySelector('[data-testid="radio-item-2"]');

    expect(radioItem1).toBeInTheDocument();
    expect(radioItem2).toBeInTheDocument();
    expect(radioItem1).toHaveAttribute('data-state', 'checked');

    await user.click(radioItem2!);
    expect(onValueChange).toHaveBeenCalledWith('option2');
  });

  it('renders DropdownMenuRadioItem with custom className', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem
              data-testid="radio-item-custom"
              value="option1"
              className="custom-radio-class"
            >
              Option 1
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const radioItem = document.querySelector('[data-testid="radio-item-custom"]');
    expect(radioItem).toBeInTheDocument();
    expect(radioItem).toHaveClass('custom-radio-class');
  });

  it('renders DropdownMenuLabel correctly', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuLabel data-testid="label">Menu Label</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const label = document.querySelector('[data-testid="label"]');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Menu Label');
  });

  it('renders DropdownMenuLabel with inset prop', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuLabel data-testid="label-inset" inset>
            Inset Label
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const label = document.querySelector('[data-testid="label-inset"]');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('pl-8');
  });

  it('renders DropdownMenuSeparator correctly', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSeparator data-testid="separator" />
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const separator = document.querySelector('[data-testid="separator"]');
    expect(separator).toBeInTheDocument();
  });

  it('renders DropdownMenuSeparator with custom className', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSeparator data-testid="separator-custom" className="custom-separator" />
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const separator = document.querySelector('[data-testid="separator-custom"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('custom-separator');
  });

  it('renders DropdownMenuSub correctly', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger data-testid="sub-trigger-in-sub">
              Sub Menu
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent data-testid="sub-content-in-sub">
              Sub Content
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const subTrigger = document.querySelector('[data-testid="sub-trigger-in-sub"]');
    expect(subTrigger).toBeInTheDocument();
  });

  it('renders DropdownMenuSubTrigger correctly', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger data-testid="sub-trigger">Sub Menu</DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const subTrigger = document.querySelector('[data-testid="sub-trigger"]');
    expect(subTrigger).toBeInTheDocument();
    expect(subTrigger).toHaveTextContent('Sub Menu');
  });

  it('renders DropdownMenuSubTrigger with inset prop', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger data-testid="sub-trigger-inset" inset>
              Inset Sub Menu
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const subTrigger = document.querySelector('[data-testid="sub-trigger-inset"]');
    expect(subTrigger).toBeInTheDocument();
    expect(subTrigger).toHaveClass('pl-8');
  });

  it('renders DropdownMenuSubContent correctly', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent data-testid="sub-content">Sub Content</DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const subContent = document.querySelector('[data-testid="sub-content"]');
    expect(subContent).toBeInTheDocument();
    expect(subContent).toHaveTextContent('Sub Content');
  });

  it('renders DropdownMenuSubContent with custom className', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent data-testid="sub-content-custom" className="custom-sub-content">
              Custom Sub Content
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const subContent = document.querySelector('[data-testid="sub-content-custom"]');
    expect(subContent).toBeInTheDocument();
    expect(subContent).toHaveClass('custom-sub-content');
  });
});
