
-- Create RPC function to upsert form buffer data
CREATE OR REPLACE FUNCTION public.upsert_form_buffer(
  p_user_id UUID,
  p_form_data JSONB,
  p_status TEXT DEFAULT 'pending'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.form_buffer (user_id, form_data, status, updated_at)
  VALUES (p_user_id, p_form_data, p_status, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    form_data = EXCLUDED.form_data,
    status = EXCLUDED.status,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to get form buffer data
CREATE OR REPLACE FUNCTION public.get_form_buffer(p_user_id UUID)
RETURNS TABLE (
  form_data JSONB,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT fb.form_data, fb.status, fb.created_at
  FROM public.form_buffer fb
  WHERE fb.user_id = p_user_id
  ORDER BY fb.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to clear form buffer
CREATE OR REPLACE FUNCTION public.clear_form_buffer(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.form_buffer WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to mark form buffer as completed
CREATE OR REPLACE FUNCTION public.mark_form_buffer_completed(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.form_buffer 
  SET status = 'completed', updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add unique constraint on user_id to ensure one buffer per user
ALTER TABLE public.form_buffer ADD CONSTRAINT form_buffer_user_id_unique UNIQUE (user_id);
