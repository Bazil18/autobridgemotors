CREATE TYPE public.app_role AS ENUM ('admin','staff','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  make text NOT NULL,
  model text NOT NULL,
  variant text,
  year integer NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  mileage integer NOT NULL DEFAULT 0,
  fuel text NOT NULL DEFAULT 'Petrol',
  transmission text NOT NULL DEFAULT 'Automatic',
  engine text,
  engine_size numeric(3,1),
  body_type text,
  colour text,
  doors integer,
  seats integer,
  registration text,
  nct_info text,
  import_info text,
  overview text,
  condition_notes text,
  features text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  video_url text,
  status text NOT NULL DEFAULT 'available',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vehicles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible vehicles" ON public.vehicles
FOR SELECT TO anon, authenticated USING (status <> 'hidden');
CREATE POLICY "Admins can view all vehicles" ON public.vehicles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert vehicles" ON public.vehicles
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update vehicles" ON public.vehicles
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vehicles" ON public.vehicles
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_label text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send an enquiry" ON public.enquiries
FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read enquiries" ON public.enquiries
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update enquiries" ON public.enquiries
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete enquiries" ON public.enquiries
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view vehicle images" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload vehicle images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update vehicle images" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vehicle images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.vehicles (slug, make, model, variant, year, price, mileage, fuel, transmission, engine, engine_size, body_type, colour, doors, seats, registration, nct_info, import_info, overview, condition_notes, features, images, status, featured) VALUES
('toyota-aqua-2019','Toyota','Aqua','S Hybrid',2019,13950,82000,'Hybrid','Automatic','1.5L Hybrid',1.5,'Hatchback','Silver',5,5,'191-D-12345','NCT valid until 09/2027','Imported from Japan, grade 4.5 auction sheet available. VRT paid, Irish registered.','A superbly economical Japanese import hybrid, ideal for city driving with outstanding fuel economy and a fully documented history.','Excellent throughout, freshly serviced with new filters and a full valet.','{"Reversing camera","Bluetooth","Climate control","Alloy wheels","Cruise control"}','{"/__l5e/assets-v1/31bf98a7-6abd-413f-bb42-dbf5540f58a0/car-1.jpg"}','available',true),
('toyota-crown-2018','Toyota','Crown','Royal Saloon',2018,18750,64000,'Hybrid','Automatic','2.5L Hybrid',2.5,'Saloon','Black',4,5,'181-D-45678','NCT valid until 03/2027','Sourced directly at Japanese auction, grade 4B. Fully imported and VRT cleared.','A genuinely luxurious executive saloon with a smooth hybrid drivetrain and a beautifully preserved leather interior.','Immaculate condition with only light cosmetic wear on the driver seat bolster.','{"Leather interior","Heated seats","Sat nav","Parking sensors","Keyless entry"}','{"/__l5e/assets-v1/03aaa8b6-47ea-4793-b9e1-6838db8e5746/car-2.jpg"}','available',true),
('honda-vezel-2019','Honda','Vezel','Hybrid Z',2019,17450,58000,'Hybrid','Automatic','1.5L Hybrid',1.5,'SUV','White',5,5,'191-D-98765','NCT valid until 11/2026','Japanese import, inspected pre-purchase and shipped via Kobe.','A compact hybrid crossover that blends SUV practicality with genuinely low running costs.','Very clean example, recently serviced with new brake pads all round.','{"Half leather","Lane assist","Reversing camera","LED headlights","Apple CarPlay"}','{"/__l5e/assets-v1/f6238872-19ce-4516-9871-85a393c466f4/car-3.jpg"}','available',true),
('mazda-axela-2018','Mazda','Axela','Sport',2018,14250,71000,'Petrol','Automatic','1.5L Petrol',1.5,'Hatchback','Grey',5,5,'181-D-33221','NCT valid until 05/2027','Imported from Japan with full auction documentation.','A sharp-handling hatchback with a premium interior and a genuinely engaging drive.','Very good condition with a full service carried out on arrival.','{"Head-up display","Cruise control","Bluetooth","Alloy wheels"}','{"/__l5e/assets-v1/31bf98a7-6abd-413f-bb42-dbf5540f58a0/car-1.jpg"}','available',false),
('nissan-xtrail-2017','Nissan','X-Trail','20X',2017,16950,89000,'Diesel','Automatic','2.0L Diesel',2.0,'SUV','White',5,7,'171-D-11223','NCT valid until 01/2027','Japanese import, VRT paid and Irish registered.','A spacious seven seat family SUV, well specified and ready to go.','Good overall condition with minor stone chips to the bonnet.','{"Seven seats","Panoramic roof","Roof rails","Reversing camera"}','{"/__l5e/assets-v1/f6238872-19ce-4516-9871-85a393c466f4/car-3.jpg"}','available',false),
('lexus-gs300h-2016','Lexus','GS 300h','Executive',2016,19950,96000,'Hybrid','Automatic','2.5L Hybrid',2.5,'Saloon','Black',4,5,'161-D-55667','NCT valid until 07/2026','Sourced at auction in Japan, grade 4 with a verified odometer.','A refined executive hybrid saloon with exceptional build quality and low running costs.','Sold in October, retained here for reference.','{"Leather interior","Mark Levinson audio","Adaptive cruise","Heated and cooled seats"}','{"/__l5e/assets-v1/03aaa8b6-47ea-4793-b9e1-6838db8e5746/car-2.jpg"}','sold',false);