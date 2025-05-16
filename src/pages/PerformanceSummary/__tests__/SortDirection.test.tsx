import { describe, expect, it } from 'vitest';

describe('PerformanceSummary getSortParams', () => {
  it('returns sort and order when sorting exists', () => {
    const getSortParams = (sorting: Array<{ id: string; desc: boolean }>) => {
      if (sorting.length > 0) {
        return {
          sort: sorting[0].id,
          order: sorting[0].desc ? 'desc' : 'asc',
        };
      }
      return {};
    };

    const sortingDesc = [{ id: 'name', desc: true }];
    expect(getSortParams(sortingDesc)).toEqual({ sort: 'name', order: 'desc' });

    const sortingAsc = [{ id: 'name', desc: false }];
    expect(getSortParams(sortingAsc)).toEqual({ sort: 'name', order: 'asc' });

    const emptySorting: Array<{ id: string; desc: boolean }> = [];
    expect(getSortParams(emptySorting)).toEqual({});
  });
});
