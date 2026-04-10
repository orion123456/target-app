import type { QueryResult, QueryResultRow } from 'pg';
import { pool } from './pool.js';

export const query = async <T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};
