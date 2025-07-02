
-- Create the try_calculator_inputs table
CREATE TABLE try_calculator_inputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repeated_course boolean NOT NULL,
  attendance_level integer CHECK (attendance_level BETWEEN 0 AND 100),
  part_time_job boolean NOT NULL,
  motivation_level integer CHECK (motivation_level BETWEEN 0 AND 10),
  first_generation boolean NOT NULL,
  friend_academics integer CHECK (friend_academics BETWEEN 0 AND 10),
  created_at timestamp WITH time zone DEFAULT now()
);

-- Enable Row Level Security (RLS) for the table
ALTER TABLE try_calculator_inputs ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all users to insert data (since this is a public form)
CREATE POLICY "Anyone can insert try calculator inputs" 
  ON try_calculator_inputs 
  FOR INSERT 
  WITH CHECK (true);

-- Create a policy to allow all users to view data (optional, for admin purposes)
CREATE POLICY "Anyone can view try calculator inputs" 
  ON try_calculator_inputs 
  FOR SELECT 
  USING (true);
