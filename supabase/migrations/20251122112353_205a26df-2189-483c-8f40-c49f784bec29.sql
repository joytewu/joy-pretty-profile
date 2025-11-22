-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  alamat TEXT NOT NULL,
  no_telp TEXT NOT NULL,
  no_identitas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medicines table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_obat TEXT NOT NULL,
  stok INTEGER NOT NULL DEFAULT 0,
  harga DECIMAL(10,2) NOT NULL DEFAULT 0,
  satuan TEXT NOT NULL DEFAULT 'tablet',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical_records table
CREATE TABLE public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  dokter_id UUID NOT NULL REFERENCES auth.users(id),
  tanggal_pemeriksaan TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  keluhan TEXT NOT NULL,
  gejala TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medical_record_id UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescription_items table
CREATE TABLE public.prescription_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id),
  jumlah INTEGER NOT NULL,
  aturan_pakai TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medical_record_id UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'transfer')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  barcode_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Admin pendaftaran can manage patients"
  ON public.patients FOR ALL
  USING (has_role(auth.uid(), 'admin_pendaftaran'::app_role));

CREATE POLICY "Dokter can view patients"
  ON public.patients FOR SELECT
  USING (has_role(auth.uid(), 'dokter'::app_role));

CREATE POLICY "Apoteker can view patients"
  ON public.patients FOR SELECT
  USING (has_role(auth.uid(), 'apoteker'::app_role));

CREATE POLICY "Pembayaran can view patients"
  ON public.patients FOR SELECT
  USING (has_role(auth.uid(), 'pembayaran'::app_role));

-- RLS Policies for medicines
CREATE POLICY "Apoteker can manage medicines"
  ON public.medicines FOR ALL
  USING (has_role(auth.uid(), 'apoteker'::app_role));

CREATE POLICY "Dokter can view medicines"
  ON public.medicines FOR SELECT
  USING (has_role(auth.uid(), 'dokter'::app_role));

-- RLS Policies for medical_records
CREATE POLICY "Dokter can manage medical records"
  ON public.medical_records FOR ALL
  USING (has_role(auth.uid(), 'dokter'::app_role));

CREATE POLICY "Apoteker can view medical records"
  ON public.medical_records FOR SELECT
  USING (has_role(auth.uid(), 'apoteker'::app_role));

CREATE POLICY "Pembayaran can view medical records"
  ON public.medical_records FOR SELECT
  USING (has_role(auth.uid(), 'pembayaran'::app_role));

-- RLS Policies for prescriptions
CREATE POLICY "Dokter can manage prescriptions"
  ON public.prescriptions FOR ALL
  USING (has_role(auth.uid(), 'dokter'::app_role));

CREATE POLICY "Apoteker can manage prescriptions"
  ON public.prescriptions FOR ALL
  USING (has_role(auth.uid(), 'apoteker'::app_role));

-- RLS Policies for prescription_items
CREATE POLICY "Dokter can manage prescription items"
  ON public.prescription_items FOR ALL
  USING (has_role(auth.uid(), 'dokter'::app_role));

CREATE POLICY "Apoteker can manage prescription items"
  ON public.prescription_items FOR ALL
  USING (has_role(auth.uid(), 'apoteker'::app_role));

-- RLS Policies for payments
CREATE POLICY "Pembayaran can manage payments"
  ON public.payments FOR ALL
  USING (has_role(auth.uid(), 'pembayaran'::app_role));

CREATE POLICY "Apoteker can view payments"
  ON public.payments FOR SELECT
  USING (has_role(auth.uid(), 'apoteker'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at
  BEFORE UPDATE ON public.medicines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();