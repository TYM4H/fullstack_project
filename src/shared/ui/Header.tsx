import { Button } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const links = [
  { label: "События", to: "/" },
  { label: "Создать", to: "/create-event" },
  { label: "Модерация", to: "/moderation" },
];

export function Header() {
  const { pathname } = useLocation();
  return (
    <header className="site-header">
      <RouterLink className="brand" to="/">
        Афиша событий
      </RouterLink>
      <nav className="main-nav" aria-label="Основная навигация">
        {links.map((link) => (
          <RouterLink
            className={pathname === link.to ? "nav-link active" : "nav-link"}
            key={link.to}
            to={link.to}
            aria-current={pathname === link.to ? "page" : undefined}
          >
            {link.label}
          </RouterLink>
        ))}
      </nav>
      <Button
        className="header-action"
        component={RouterLink}
        to="/create-event"
        variant="contained"
      >
        Создать событие
      </Button>
    </header>
  );
}
