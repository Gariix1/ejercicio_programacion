export interface ApiLinks {
  self?: string;
  first?: string;
  last?: string;
  prev?: string | null;
  next?: string | null;
  [key: string]: string | null | undefined;
}

export interface ApiPaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiMeta {
  module?: string;
  type?: string;
  message?: string;
  pagination?: ApiPaginationMeta;
  [key: string]: unknown;
}

export interface ApiResource<TAttributes, TRelationships = Record<string, never>> {
  type: string;
  id: string;
  attributes: TAttributes;
  relationships?: TRelationships;
  links?: ApiLinks;
}

export interface ApiDocument<TData> {
  data: TData;
  meta: ApiMeta;
  links: ApiLinks;
}

export interface ApiErrorItem {
  status: number;
  code: string;
  title: string;
  detail: string;
  source?: Record<string, unknown>;
}

export interface ApiErrorDocument {
  errors: ApiErrorItem[];
  meta: {
    request_status: string;
    error_type: string;
    error_count: number;
  };
}
