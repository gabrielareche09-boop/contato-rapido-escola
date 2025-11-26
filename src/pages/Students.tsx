import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Class, Grade, Student } from "@/types/student";
import { LogOut, Phone, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<Grade | "all">("all");
  const [selectedClass, setSelectedClass] = useState<Class | "all">("all");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | "all">(
    "all"
  );

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  // Carrega todos os JSONs em /src/data/** usando import.meta.glob (Vite)
  useEffect(() => {
    try {
      const modules = import.meta.glob("/src/data/**/*.json", {
        query: "?json",
        eager: true,
      });
      const all = Object.entries(modules).flatMap(([p, mod]) => {
        const arr = Array.isArray(mod)
          ? mod
          : Array.isArray((mod as any)?.default)
          ? (mod as any).default
          : [];
        const m =
          p.match(/(?:\/|\.\/)?src\/data\/([^/]+)\/([^/]+)\.json$/) ||
          p.match(/(?:\/|\.\/)?data\/([^/]+)\/([^/]+)\.json$/);
        const gradeFromPath = m ? m[1] : undefined;
        const classFromPath = m ? m[2] : undefined;
        return arr.map((s) => ({
          ...s,
          __grade: gradeFromPath,
          __class: classFromPath,
        }));
      });

      setStudents(all);
      setFilteredStudents(all);
    } catch (err) {
      console.error("Erro ao carregar JSONs (eager):", err);
    }
  }, []);

  // filtro (agora usa grade/turma derivadas do caminho)
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.nome.toLowerCase().includes(q) ||
          student.celular_mae?.includes(q) ||
          student.celular_pai?.includes(q)
      );
    }

    if (selectedGrade !== "all") {
      filtered = filtered.filter((s) => (s as any).__grade === selectedGrade);
    }
    if (selectedClass !== "all") {
      filtered = filtered.filter((s) => (s as any).__class === selectedClass);
    }
    // selectedBuilding: só se você tiver essa meta (veja nota abaixo)

    setFilteredStudents(filtered);
  }, [searchTerm, selectedGrade, selectedClass, selectedBuilding, students]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return "N/A";
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatGrade = (g?: string | undefined) => {
    if (!g) return "";
    const map: Record<string, string> = {
      "1-ano": "1º ano",
      "2-ano": "2º ano",
      "3-ano": "3º ano",
      "4-ano": "4º ano",
      "5-ano": "5º ano",
      "6-ano": "6º ano",
      "7-ano": "7º ano",
      "8-ano": "8º ano",
      "9-ano": "9º ano",
      "1-medio": "1º médio",
      "2-medio": "2º médio",
      "3-medio": "3º médio",
      // variações que podem aparecer
      "1 ano": "1º ano",
      "2 ano": "2º ano",
      "1 medio": "1º médio",
      "1 médio": "1º médio",
    };
    return map[g] ?? g;
  };

  const formatClass = (c?: string | undefined) => {
    if (!c) return "";
    return `Turma ${c.toString().toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Contatos dos Alunos</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            value={selectedGrade}
            onValueChange={(value) => setSelectedGrade(value as Grade | "all")}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              <SelectItem value="1-ano">1º ano</SelectItem>
              <SelectItem value="2-ano">2º ano</SelectItem>
              <SelectItem value="3-ano">3º ano</SelectItem>
              <SelectItem value="4-ano">4º ano</SelectItem>
              <SelectItem value="5-ano">5º ano</SelectItem>
              <SelectItem value="6-ano">6º ano</SelectItem>
              <SelectItem value="7-ano">7º ano</SelectItem>
              <SelectItem value="8-ano">8º ano</SelectItem>
              <SelectItem value="9-ano">9º ano</SelectItem>
              <SelectItem value="1-medio">1º médio</SelectItem>
              <SelectItem value="2-medio">2º médio</SelectItem>
              <SelectItem value="3-medio">3º médio</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedClass}
            onValueChange={(value) => setSelectedClass(value as Class | "all")}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as turmas</SelectItem>
              <SelectItem value="A">Turma A</SelectItem>
              <SelectItem value="B">Turma B</SelectItem>
              <SelectItem value="C">Turma C</SelectItem>
              <SelectItem value="D">Turma D</SelectItem>
              <SelectItem value="E">Turma E</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedBuilding}
            onValueChange={(value) =>
              setSelectedBuilding(value as Building | "all")
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Prédio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os prédios</SelectItem>
              <SelectItem value="redondo">Redondo</SelectItem>
              <SelectItem value="mangal">Mangal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          {filteredStudents.length} aluno
          {filteredStudents.length !== 1 ? "s" : ""} encontrado
          {filteredStudents.length !== 1 ? "s" : ""}
        </p>

        {/* Students List */}
        <div className="space-y-3">
          {filteredStudents.map((student, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">
                  {student.nome}
                  {/* mostra ano e turma se existir */}
                  {(student as any).__grade || (student as any).__class ? (
                    <span className="text-sm text-muted-foreground font-normal ml-2">
                      ({formatGrade((student as any).__grade)}
                      {(student as any).__grade && (student as any).__class
                        ? " • "
                        : ""}
                      {(student as any).__class
                        ? formatClass((student as any).__class)
                        : ""}
                      )
                    </span>
                  ) : null}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Mãe</p>
                      <p className="font-medium">
                        {formatPhone(student.celular_mae || student.celularMae)}
                      </p>
                    </div>
                    {(student.celular_mae || student.celularMae) && (
                      <Button size="sm" className="ml-2" asChild>
                        <a href={`tel:${student.celular_mae}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Ligar
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Pai</p>
                      <p className="font-medium">
                        {formatPhone(student.celular_pai || student.celularPai)}
                      </p>
                    </div>
                    {(student.celular_pai || student.celularPai) && (
                      <Button size="sm" className="ml-2" asChild>
                        <a href={`tel:${student.celular_pai}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Ligar
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum aluno encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
