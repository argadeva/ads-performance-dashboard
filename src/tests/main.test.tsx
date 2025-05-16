//@vitest-environment jsdom
import { vi } from 'vitest';

//Mock the root element
document.body.innerHTML = '<div id="root"></div>';

//Mock react-dom/client before importing main
const createRootMock = vi.fn(() => ({ render: vi.fn() }));
vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

describe('main.tsx', () => {
  it('renders App into #root', async () => {
    await import('@/main');
    expect(createRootMock).toHaveBeenCalled();
    const rootElement = document.getElementById('root');
    expect(rootElement).not.toBeNull();
  });
});
