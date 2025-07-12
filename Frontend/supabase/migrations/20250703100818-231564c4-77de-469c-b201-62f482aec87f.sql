
-- Add recommendation column to try_calculator_inputs table
ALTER TABLE try_calculator_inputs ADD COLUMN recommendation text;

-- Also add recommendation column to predictions table for consistency
ALTER TABLE predictions ADD COLUMN recommendation text;
