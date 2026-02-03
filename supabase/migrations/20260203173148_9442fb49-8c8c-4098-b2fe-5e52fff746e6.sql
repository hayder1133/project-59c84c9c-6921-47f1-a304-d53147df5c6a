-- Create expenses table for household expense tracking
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  payee TEXT NOT NULL,
  notes TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Users can view their own expenses
CREATE POLICY "Users can view their own expenses"
ON public.expenses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own expenses
CREATE POLICY "Users can create their own expenses"
ON public.expenses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own expenses
CREATE POLICY "Users can update their own expenses"
ON public.expenses
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own expenses
CREATE POLICY "Users can delete their own expenses"
ON public.expenses
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_category ON public.expenses(category);