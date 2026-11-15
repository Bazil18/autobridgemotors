DROP POLICY IF EXISTS "Anyone can send an enquiry" ON public.enquiries;
CREATE POLICY "Anyone can send a valid enquiry" ON public.enquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  handled = false
  AND length(btrim(name)) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 50)
  AND (subject IS NULL OR length(subject) <= 300)
  AND (vehicle_label IS NULL OR length(vehicle_label) <= 300)
  AND length(btrim(message)) BETWEEN 1 AND 5000
);