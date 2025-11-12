import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  Users, 
  Clock, 
  TrendingUp, 
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Heart,
  Pill,
  UserCheck,
  AlertCircle,
  Eye,
  FileText,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface KlinikData {
  klinik: {
    nama: string;
    lokasi: string;
    telepon: string;
    email: string;
    jamOperasional: {
      senin_jumat: string;
      sabtu: string;
      minggu: string;
    };
    layanan: Array<{
      id: number;
      nama: string;
      deskripsi: string;
      durasi: string;
      harga: string;
    }>;
  };
  dokter: Array<{
    id: number;
    nama: string;
    spesialisasi: string;
    pengalaman: string;
    jadwal: string[];
    foto: string;
  }>;
  pasienHariIni: Array<{
    nomorAntrian: string;
    nama: string;
    umur: number;
    keluhan: string;
    status: string;
    waktuDaftar: string;
  }>;
  statistik: {
    pasienHariIni: number;
    pasienMingguIni: number;
    pasienBulanIni: number;
    tingkatKepuasan: string;
    waktuTungguRataRata: string;
  };
  teamInfo: {
    kelompok: Array<{
      nama: string;
      nim?: string;
      peran: string;
    }>;
    mataKuliah: string;
    judulTugas: string;
  };
}

const fetchKlinikData = async (): Promise<KlinikData> => {
  const response = await fetch("/db.json");
  if (!response.ok) {
    throw new Error("Failed to fetch klinik data");
  }
  return response.json();
};

const KlinikSentosa = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["klinikData"],
    queryFn: fetchKlinikData,
  });

  const [selectedPasien, setSelectedPasien] = useState<typeof data.pasienHariIni[0] | null>(null);
  const [selectedDokter, setSelectedDokter] = useState<typeof data.dokter[0] | null>(null);
  const [selectedLayanan, setSelectedLayanan] = useState<typeof data.klinik.layanan[0] | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 text-primary animate-pulse mx-auto" />
          <p className="text-lg text-muted-foreground">Memuat data klinik...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="max-w-md shadow-medium">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <p className="text-foreground">Gagal memuat data klinik</p>
            <Button onClick={() => window.location.reload()}>Muat Ulang</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sedang diperiksa":
        return "bg-info text-info-foreground";
      case "menunggu":
        return "bg-warning text-warning-foreground";
      case "selesai":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-gradient-primary shadow-medium">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {data.klinik.nama}
              </h1>
              <p className="text-white/90 text-lg">Melayani Dengan Sepenuh Hati</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 text-white/95">
              <MapPin className="w-5 h-5" />
              <span>{data.klinik.lokasi}</span>
            </div>
            <div className="flex items-center gap-3 text-white/95">
              <Phone className="w-5 h-5" />
              <span>{data.klinik.telepon}</span>
            </div>
            <div className="flex items-center gap-3 text-white/95">
              <Mail className="w-5 h-5" />
              <span>{data.klinik.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistik Dashboard */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Statistik Real-Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pasien Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-primary">
                    {data.statistik.pasienHariIni}
                  </p>
                  <Users className="w-8 h-8 text-primary/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Minggu Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-accent">
                    {data.statistik.pasienMingguIni}
                  </p>
                  <Calendar className="w-8 h-8 text-accent/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Bulan Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-info">
                    {data.statistik.pasienBulanIni}
                  </p>
                  <TrendingUp className="w-8 h-8 text-info/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Kepuasan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-warning">
                    {data.statistik.tingkatKepuasan}
                  </p>
                  <Star className="w-8 h-8 text-warning/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Waktu Tunggu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-success">
                    {data.statistik.waktuTungguRataRata}
                  </p>
                  <Clock className="w-8 h-8 text-success/30" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Antrian Pasien */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-primary" />
              Antrian Pasien Hari Ini
            </h2>
            <div className="space-y-3">
              {data.pasienHariIni.map((pasien) => (
                <Card 
                  key={pasien.nomorAntrian} 
                  className="bg-gradient-card shadow-soft hover:shadow-medium transition-all cursor-pointer"
                  onClick={() => setSelectedPasien(pasien)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-lg font-bold px-3 py-1 border-primary text-primary">
                            {pasien.nomorAntrian}
                          </Badge>
                          <h3 className="font-semibold text-lg text-foreground">
                            {pasien.nama}
                          </h3>
                          <span className="text-muted-foreground">
                            ({pasien.umur} tahun)
                          </span>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          {pasien.keluhan}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Terdaftar: {pasien.waktuDaftar}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(pasien.status)}>
                          {pasien.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Dokter */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Tim Dokter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.dokter.map((dokter) => (
                  <div 
                    key={dokter.id} 
                    className="flex gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setSelectedDokter(dokter)}
                  >
                    <img
                      src={dokter.foto}
                      alt={dokter.nama}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {dokter.nama}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {dokter.spesialisasi}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pengalaman: {dokter.pengalaman}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dokter.jadwal.map((hari) => (
                          <Badge key={hari} variant="secondary" className="text-xs">
                            {hari}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Jam Operasional */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Jam Operasional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Senin - Jumat</span>
                  <span className="font-semibold text-foreground">
                    {data.klinik.jamOperasional.senin_jumat}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Sabtu</span>
                  <span className="font-semibold text-foreground">
                    {data.klinik.jamOperasional.sabtu}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Minggu</span>
                  <span className="font-semibold text-destructive">
                    {data.klinik.jamOperasional.minggu}
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Layanan */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Pill className="w-6 h-6 text-primary" />
            Layanan Kami
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.klinik.layanan.map((layanan) => (
              <Card 
                key={layanan.id} 
                className="bg-gradient-card shadow-soft hover:shadow-strong transition-all group cursor-pointer"
                onClick={() => setSelectedLayanan(layanan)}
              >
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {layanan.nama}
                  </CardTitle>
                  <CardDescription>{layanan.deskripsi}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Durasi: {layanan.durasi}</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {layanan.harga}
                  </div>
                  <Button size="sm" variant="outline" className="w-full gap-2">
                    <Eye className="w-4 h-4" />
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Info Footer */}
        <Card className="shadow-medium bg-gradient-primary text-white">
          <CardHeader>
            <CardTitle className="text-white">Tim Pengembang Sistem</CardTitle>
            <CardDescription className="text-white/80">
              {data.teamInfo.mataKuliah} - {data.teamInfo.judulTugas}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.teamInfo.kelompok.map((anggota, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h4 className="font-semibold text-white">{anggota.nama}</h4>
                  {anggota.nim && (
                    <p className="text-sm text-white/80">{anggota.nim}</p>
                  )}
                  <Badge variant="secondary" className="mt-2">
                    {anggota.peran}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialog Detail Pasien */}
      <Dialog open={!!selectedPasien} onOpenChange={() => setSelectedPasien(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Badge variant="outline" className="text-xl font-bold px-4 py-2 border-primary text-primary">
                {selectedPasien?.nomorAntrian}
              </Badge>
              Detail Pasien
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap data pasien dan status pemeriksaan
            </DialogDescription>
          </DialogHeader>
          
          {selectedPasien && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                  <p className="text-lg font-semibold text-foreground">{selectedPasien.nama}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Umur</label>
                  <p className="text-lg font-semibold text-foreground">{selectedPasien.umur} tahun</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Keluhan Pasien
                </label>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-foreground">{selectedPasien.keluhan}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Waktu Pendaftaran
                  </label>
                  <p className="text-lg font-semibold text-foreground">{selectedPasien.waktuDaftar}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={getStatusColor(selectedPasien.status)}>
                    {selectedPasien.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Catatan Medis
                </h4>
                <Card className="bg-gradient-card">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tekanan Darah:</span>
                      <span className="font-medium">120/80 mmHg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Suhu Tubuh:</span>
                      <span className="font-medium">36.5°C</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Berat Badan:</span>
                      <span className="font-medium">65 kg</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <FileText className="w-4 h-4" />
                  Cetak Rekam Medis
                </Button>
                <Button variant="outline" onClick={() => setSelectedPasien(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Detail Dokter */}
      <Dialog open={!!selectedDokter} onOpenChange={() => setSelectedDokter(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              Profil Dokter
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai dokter dan jadwal praktik
            </DialogDescription>
          </DialogHeader>
          
          {selectedDokter && (
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <img
                  src={selectedDokter.foto}
                  alt={selectedDokter.nama}
                  className="w-32 h-32 rounded-lg object-cover border-4 border-primary shadow-medium"
                />
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">{selectedDokter.nama}</h3>
                  <Badge className="bg-primary text-primary-foreground">
                    {selectedDokter.spesialisasi}
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="w-5 h-5" />
                    <span>Pengalaman {selectedDokter.pengalaman}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Jadwal Praktik
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDokter.jadwal.map((hari) => (
                    <Card key={hari} className="bg-gradient-card">
                      <CardContent className="pt-4 text-center">
                        <p className="font-semibold text-foreground">{hari}</p>
                        <p className="text-sm text-muted-foreground mt-1">08:00 - 14:00</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Keahlian Khusus</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Pemeriksaan Umum</Badge>
                  <Badge variant="secondary">Konsultasi Kesehatan</Badge>
                  <Badge variant="secondary">Medical Check-up</Badge>
                  <Badge variant="secondary">Vaksinasi</Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Calendar className="w-4 h-4" />
                  Buat Janji Temu
                </Button>
                <Button variant="outline" onClick={() => setSelectedDokter(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Detail Layanan */}
      <Dialog open={!!selectedLayanan} onOpenChange={() => setSelectedLayanan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Pill className="w-6 h-6 text-primary" />
              Detail Layanan
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai layanan kesehatan
            </DialogDescription>
          </DialogHeader>
          
          {selectedLayanan && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {selectedLayanan.nama}
                </h3>
                <p className="text-muted-foreground">{selectedLayanan.deskripsi}</p>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Durasi Layanan</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{selectedLayanan.durasi}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-5 h-5 text-warning" />
                      <span className="text-sm font-medium text-muted-foreground">Tarif</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{selectedLayanan.harga}</p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Yang Perlu Disiapkan</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>Kartu identitas (KTP/SIM/Paspor)</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>Kartu BPJS (jika ada)</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>Riwayat medis sebelumnya (jika ada)</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Prosedur Layanan</h4>
                <div className="space-y-3">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Badge className="bg-primary text-primary-foreground">1</Badge>
                        <div>
                          <p className="font-medium text-foreground">Pendaftaran</p>
                          <p className="text-sm text-muted-foreground">Daftar di loket dengan membawa identitas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Badge className="bg-primary text-primary-foreground">2</Badge>
                        <div>
                          <p className="font-medium text-foreground">Anamnesis</p>
                          <p className="text-sm text-muted-foreground">Perawat akan mencatat keluhan dan tanda vital</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Badge className="bg-primary text-primary-foreground">3</Badge>
                        <div>
                          <p className="font-medium text-foreground">Pemeriksaan</p>
                          <p className="text-sm text-muted-foreground">Dokter akan melakukan pemeriksaan sesuai keluhan</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Badge className="bg-primary text-primary-foreground">4</Badge>
                        <div>
                          <p className="font-medium text-foreground">Pembayaran</p>
                          <p className="text-sm text-muted-foreground">Lakukan pembayaran di kasir dan ambil obat jika ada resep</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Calendar className="w-4 h-4" />
                  Daftar Sekarang
                </Button>
                <Button variant="outline" onClick={() => setSelectedLayanan(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KlinikSentosa;
