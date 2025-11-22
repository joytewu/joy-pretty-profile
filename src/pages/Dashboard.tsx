import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Users, Stethoscope, Pill, CreditCard } from "lucide-react";
import { Loader2 } from "lucide-react";

type UserRole = "admin_pendaftaran" | "dokter" | "pasien" | "apoteker" | "pembayaran";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Get user role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleError || !roleData) {
        toast({
          title: "Error",
          description: "Anda belum memiliki role. Silakan hubungi administrator.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setUserRole(roleData.role);
      setUserProfile(profileData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getRoleInfo = () => {
    switch (userRole) {
      case "admin_pendaftaran":
        return {
          title: "Admin Pendaftaran",
          description: "Kelola pendaftaran pasien",
          icon: Users,
          path: "/admin-pendaftaran",
        };
      case "dokter":
        return {
          title: "Dokter",
          description: "Pemeriksaan dan diagnosis pasien",
          icon: Stethoscope,
          path: "/dokter",
        };
      case "apoteker":
        return {
          title: "Apoteker",
          description: "Kelola obat dan resep",
          icon: Pill,
          path: "/apoteker",
        };
      case "pembayaran":
        return {
          title: "Kasir",
          description: "Proses pembayaran pasien",
          icon: CreditCard,
          path: "/pembayaran",
        };
      default:
        return {
          title: "Dashboard",
          description: "Selamat datang",
          icon: User,
          path: "/",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const roleInfo = getRoleInfo();
  const Icon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Klinik Sentosa
          </h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-primary/20 hover:bg-primary/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-elegant animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <Icon className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl">{roleInfo.title}</CardTitle>
            <CardDescription className="text-lg">{roleInfo.description}</CardDescription>
            {userProfile && (
              <p className="text-sm text-muted-foreground">
                {userProfile.full_name || "User"}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {userRole ? (
              <Button
                onClick={() => navigate(roleInfo.path)}
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-elegant"
              >
                Masuk ke {roleInfo.title}
              </Button>
            ) : (
              <div className="text-center p-6 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  Akun Anda belum memiliki role. Silakan hubungi administrator untuk
                  mendapatkan akses.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;