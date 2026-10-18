import { Alert, Button, CircularProgress } from "@mui/material";
import type { ReactNode } from "react";

type DataStateProps = {
  status: "loading" | "success" | "error";
  error: string;
  onRetry: () => void;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children: ReactNode;
};
export function DataState({
  status,
  error,
  onRetry,
  empty,
  emptyTitle = "Пока ничего нет",
  emptyDescription,
  children,
}: DataStateProps) {
  if (status === "loading")
    return (
      <div className="data-state" role="status">
        <CircularProgress size={32} />
        <p>Загружаем данные…</p>
      </div>
    );
  if (status === "error")
    return (
      <Alert
        severity="error"
        className="data-state-error"
        action={
          <Button color="inherit" onClick={onRetry}>
            Повторить загрузку
          </Button>
        }
      >
        {error}
      </Alert>
    );
  if (empty)
    return (
      <section className="data-state" role="status">
        <h2>{emptyTitle}</h2>
        {emptyDescription && <p>{emptyDescription}</p>}
      </section>
    );
  return children;
}
