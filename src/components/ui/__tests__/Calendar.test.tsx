import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Calendar } from '../Calendar';

describe('Calendar', () => {
  it('renders without crashing', () => {
    render(<Calendar />);
    expect(document.querySelector('.p-3')).toBeInTheDocument();
  });
});
