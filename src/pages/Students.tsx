import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, LogOut, Search } from "lucide-react";
import { Student, Grade, Class, Building } from "@/types/student";
import { loadAllStudents } from "@/data/loadStudents";

const Students = () => {
  const navigate = useNavigate();
  const allStudents = loadAllStudents();
  const [students] = useState<Student[]>(allStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(allStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<Grade | "all">("all");
  const [selectedClass, setSelectedClass] = useState<Class | "all">("all");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | "all">("all");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = students;

    // Filter by grade
    if (selectedGrade !== "all") {
      filtered = filtered.filter((student) => student.ano === selectedGrade);
    }

    // Filter by class
    if (selectedClass !== "all") {
      filtered = filtered.filter((student) => student.turma === selectedClass);
    }

    // Filter by building
    if (selectedBuilding !== "all") {
      filtered = filtered.filter((student) => student.predio === selectedBuilding);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.celular_mae?.includes(searchTerm) ||
          student.celular_pai?.includes(searchTerm)
      );
    }

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
          <Select value={selectedGrade} onValueChange={(value) => setSelectedGrade(value as Grade | "all")}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              <SelectItem value="1 ano">1º ano</SelectItem>
              <SelectItem value="2 ano">2º ano</SelectItem>
              <SelectItem value="3 ano">3º ano</SelectItem>
              <SelectItem value="4 ano">4º ano</SelectItem>
              <SelectItem value="5 ano">5º ano</SelectItem>
              <SelectItem value="6 ano">6º ano</SelectItem>
              <SelectItem value="7 ano">7º ano</SelectItem>
              <SelectItem value="8 ano">8º ano</SelectItem>
              <SelectItem value="9 ano">9º ano</SelectItem>
              <SelectItem value="1 medio">1º médio</SelectItem>
              <SelectItem value="2 medio">2º médio</SelectItem>
              <SelectItem value="3 medio">3º médio</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value as Class | "all")}>
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

          <Select value={selectedBuilding} onValueChange={(value) => setSelectedBuilding(value as Building | "all")}>
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
          {filteredStudents.length} aluno{filteredStudents.length !== 1 ? "s" : ""} encontrado{filteredStudents.length !== 1 ? "s" : ""}
        </p>

        {/* Students List */}
        <div className="space-y-3">
          {filteredStudents.map((student, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">{student.nome}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Mãe</p>
                      <p className="font-medium">{formatPhone(student.celular_mae)}</p>
                    </div>
                    {student.celular_mae && (
                      <Button
                        size="sm"
                        className="ml-2"
                        asChild
                      >
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
                      <p className="font-medium">{formatPhone(student.celular_pai)}</p>
                    </div>
                    {student.celular_pai && (
                      <Button
                        size="sm"
                        className="ml-2"
                        asChild
                      >
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
