import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  Calendar, 
  Mail, 
  Phone, 
  BookOpen, 
  Users,
  PenTool,
  Palette,
  Award,
  Briefcase
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  faculty: string;
  major: string;
  semester: number;
  level: number;
  dateOfBirth: string;
  email: string;
  phone: string;
  academicInfo: {
    studentId: string;
    enrollmentYear: number;
    expectedGraduation: number;
    gpa: string;
  };
  organizations: Array<{
    id: number;
    name: string;
    position: string;
    period: string;
    description: string;
  }>;
  hobbies: Array<{
    id: number;
    name: string;
    icon: string;
  }>;
}

const fetchStudent = async (): Promise<Student> => {
  const response = await fetch("/db.json");
  if (!response.ok) {
    throw new Error("Failed to fetch student data");
  }
  const data = await response.json();
  return data.student;
};

const getHobbyIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    PenTool,
    Palette,
  };
  return icons[iconName] || BookOpen;
};

const StudentProfile = () => {
  const { data: student, isLoading, error } = useQuery({
    queryKey: ["student"],
    queryFn: fetchStudent,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data mahasiswa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {(error as Error).message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Card */}
        <Card className="overflow-hidden border-0 shadow-[var(--shadow-medium)]">
          <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
          <CardContent className="pt-0 px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-primary" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left mt-16 md:mt-4">
                <h1 className="text-3xl font-bold text-foreground mb-2">{student.name}</h1>
                <p className="text-lg text-muted-foreground mb-3">{student.major}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="w-3 h-3" />
                    Semester {student.semester}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Award className="w-3 h-3" />
                    Tingkat {student.level}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <GraduationCap className="w-3 h-3" />
                    IPK {student.academicInfo.gpa}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                  <p className="font-medium">{formatDate(student.dateOfBirth)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Informasi Akademik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Fakultas</p>
                  <p className="font-medium">{student.faculty}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">NIM</p>
                  <p className="font-medium">{student.academicInfo.studentId}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Tahun Masuk - Lulus</p>
                  <p className="font-medium">
                    {student.academicInfo.enrollmentYear} - {student.academicInfo.expectedGraduation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Organisasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.organizations.map((org) => (
                <div
                  key={org.id}
                  className="p-4 rounded-lg border bg-gradient-to-br from-card to-muted/20 hover:shadow-[var(--shadow-soft)] transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{org.name}</h3>
                      <Badge variant="outline" className="text-xs mb-2">
                        {org.position}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{org.description}</p>
                  <p className="text-xs text-muted-foreground">Periode: {org.period}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hobbies */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Hobi & Minat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {student.hobbies.map((hobby) => {
                const Icon = getHobbyIcon(hobby.icon);
                return (
                  <div
                    key={hobby.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <span className="font-medium">{hobby.name}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
