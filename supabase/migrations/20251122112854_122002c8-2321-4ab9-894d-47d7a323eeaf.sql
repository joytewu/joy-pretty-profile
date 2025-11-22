-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin pendaftaran can manage patients" ON public.patients;
DROP POLICY IF EXISTS "Dokter can view patients" ON public.patients;
DROP POLICY IF EXISTS "Apoteker can view patients" ON public.patients;
DROP POLICY IF EXISTS "Pembayaran can view patients" ON public.patients;

DROP POLICY IF EXISTS "Apoteker can manage medicines" ON public.medicines;
DROP POLICY IF EXISTS "Dokter can view medicines" ON public.medicines;

DROP POLICY IF EXISTS "Dokter can manage medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Apoteker can view medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Pembayaran can view medical records" ON public.medical_records;

DROP POLICY IF EXISTS "Dokter can manage prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Apoteker can manage prescriptions" ON public.prescriptions;

DROP POLICY IF EXISTS "Dokter can manage prescription items" ON public.prescription_items;
DROP POLICY IF EXISTS "Apoteker can manage prescription items" ON public.prescription_items;

DROP POLICY IF EXISTS "Pembayaran can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Apoteker can view payments" ON public.payments;

-- Create open policies for all authenticated users
CREATE POLICY "All authenticated users can manage patients"
  ON public.patients FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage medicines"
  ON public.medicines FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage medical records"
  ON public.medical_records FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage prescriptions"
  ON public.prescriptions FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage prescription items"
  ON public.prescription_items FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage payments"
  ON public.payments FOR ALL
  USING (auth.role() = 'authenticated');