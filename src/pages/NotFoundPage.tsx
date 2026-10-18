import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PageContainer } from "../shared/ui/PageContainer";

export function NotFoundPage() {
  return (
    <PageContainer>
      <section className="not-found">
        <div className="error-number">404</div>
        <h1>Похоже, такой страницы нет</h1>
        <p>Возможно, она была перенесена или ссылка устарела.</p>
        <Button component={RouterLink} to="/" variant="contained">
          Вернуться к событиям
        </Button>
      </section>
    </PageContainer>
  );
}
