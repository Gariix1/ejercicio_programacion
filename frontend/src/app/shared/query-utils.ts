type FlatValue = string | number | boolean | null | undefined;

export interface ListQueryParamsInput {
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export function areFlatValuesEqual<T extends object>(previous: T, current: T): boolean {
  const previousRecord = previous as Record<string, FlatValue>;
  const currentRecord = current as Record<string, FlatValue>;
  const previousKeys = Object.keys(previousRecord);
  const currentKeys = Object.keys(currentRecord);

  if (previousKeys.length !== currentKeys.length) {
    return false;
  }

  return previousKeys.every((key) => previousRecord[key] === currentRecord[key]);
}

export function buildListQueryParams(query: ListQueryParamsInput = {}): URLSearchParams {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search);
  }

  if (query.sortBy) {
    params.set('sort_by', query.sortBy);
  }

  if (query.sortDir) {
    params.set('sort_dir', query.sortDir);
  }

  if (query.page) {
    params.set('page', String(query.page));
  }

  if (query.perPage) {
    params.set('per_page', String(query.perPage));
  }

  return params;
}
