
-- Create form_buffer table to temporarily store form data
CREATE TABLE public.form_buffer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_buffer ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own form buffer data"
  ON public.form_buffer
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_form_buffer_user_id ON public.form_buffer(user_id);
CREATE INDEX idx_form_buffer_status ON public.form_buffer(status);
