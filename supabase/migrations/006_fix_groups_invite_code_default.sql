-- Fix invite_code default: extensions.gen_random_bytes can fail if pgcrypto
-- is not in the extensions schema or search path. Use built-in functions only.
ALTER TABLE public.groups
  ALTER COLUMN invite_code SET DEFAULT substring(md5(random()::text || clock_timestamp()::text), 1, 12);
