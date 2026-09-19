import { Container } from "@mui/material";
import type { ReactNode } from "react";

type PageContainerProps = { children: ReactNode };

export function PageContainer({ children }: PageContainerProps) {
  return <Container sx={{ py: 4 }}>{children}</Container>;
}
