import { render } from '@testing-library/react';

import { Separator } from '../Separator';

describe('Separator', () => {
  it('renders separator root', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('[data-slot="separator-root"]')).toBeInTheDocument();
  });
});
