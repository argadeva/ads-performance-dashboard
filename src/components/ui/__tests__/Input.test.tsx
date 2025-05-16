import { render } from '@testing-library/react';

import { Input } from '../Input';

describe('Input', () => {
  it('renders input element', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('[data-slot="input"]')).toBeInTheDocument();
  });
  it('sets type attribute', () => {
    const { container } = render(<Input type="password" />);
    expect(container.querySelector('input')).toHaveAttribute('type', 'password');
  });
});
