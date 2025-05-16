import { render } from '@testing-library/react';

import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders skeleton div', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
  });
});
