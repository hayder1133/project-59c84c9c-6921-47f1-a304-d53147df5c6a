-- Add is_paid column to track debt settlement status
ALTER TABLE public.expenses 
ADD COLUMN is_paid BOOLEAN DEFAULT true;

-- Set existing debt entries as unpaid by default
UPDATE public.expenses 
SET is_paid = false 
WHERE category = 'debt';

-- Comment for clarity
COMMENT ON COLUMN public.expenses.is_paid IS 'For debt category: false = unpaid debt, true = settled. For other categories: always true.';