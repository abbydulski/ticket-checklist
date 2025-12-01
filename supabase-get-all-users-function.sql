-- Create a function to get all users from auth.users
-- This allows us to query all registered users, not just those who created tickets

CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges to access auth.users
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email::TEXT
  FROM auth.users au
  WHERE au.email IS NOT NULL
  ORDER BY au.email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_users() TO authenticated;

