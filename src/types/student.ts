export interface Student {
  nome: string;
  celular_mae?: string;
  celular_pai?: string;
  celularMae?: string;
  celularPai?: string;

  // campos derivados do caminho /src/data/... (opcionais)
  __grade?: string; // ex: "1-ano" ou "1-medio" dependendo do nome da pasta
  __class?: string; // ex: "A", "B", ...
}

export type Grade =
  | "1 ano"
  | "2 ano"
  | "3 ano"
  | "4 ano"
  | "5 ano"
  | "6 ano"
  | "7 ano"
  | "8 ano"
  | "9 ano"
  | "1 medio"
  | "2 medio"
  | "3 medio";
export type Class = "A" | "B" | "C" | "D" | "E";
export type Building = "redondo" | "mangal";
