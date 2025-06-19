export interface Alert {
  id?: number;
  body: string;
  type: "error" | "success" | "info" | "warning";
}
