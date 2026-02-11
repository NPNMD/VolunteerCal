-- Reload PostgREST schema cache so it picks up FK relationships and latest schema.
-- Run this after migrations that change tables, FKs, or when 500 errors occur on embed queries.
NOTIFY pgrst, 'reload schema';
