import { Student, Grade, Class } from "@/types/student";

// Import all JSON files from the data directory
const studentFiles = import.meta.glob<{ default: Array<{ nome: string; celular_mae?: string; celular_pai?: string }> }>('./**/*.json', { eager: true });

export function loadAllStudents(): Student[] {
  const allStudents: Student[] = [];

  for (const path in studentFiles) {
    // Extract grade and class from path
    // Path format: ./1-ano/A.json or ./1-medio/B.json
    const match = path.match(/\.\/(.+)\/([A-E])\.json$/);
    
    if (match) {
      const gradeFolder = match[1]; // e.g., "1-ano" or "1-medio"
      const turma = match[2] as Class;
      
      // Convert folder name to Grade type
      let ano: Grade;
      if (gradeFolder.includes('medio')) {
        const num = gradeFolder.replace('-medio', '');
        ano = `${num} medio` as Grade;
      } else {
        const num = gradeFolder.replace('-ano', '');
        ano = `${num} ano` as Grade;
      }
      
      // Get students from this file
      const students = studentFiles[path].default;
      
      // Add metadata to each student
      students.forEach(student => {
        allStudents.push({
          ...student,
          ano,
          turma,
        });
      });
    }
  }

  return allStudents;
}
