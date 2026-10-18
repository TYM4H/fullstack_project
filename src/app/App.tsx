import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Header } from "../shared/ui/Header";
import { EventPage } from "../pages/EventPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PageContainer } from "../shared/ui/PageContainer";

const CreateEventPage = lazy(() =>
  import("../pages/CreateEventPage").then((module) => ({
    default: module.CreateEventPage,
  })),
);
const ModerationPage = lazy(() =>
  import("../pages/ModerationPage").then((module) => ({
    default: module.ModerationPage,
  })),
);
const TicketPage = lazy(() =>
  import("../pages/TicketPage").then((module) => ({
    default: module.TicketPage,
  })),
);

function App() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <PageContainer>
            <p role="status">Загружаем страницу…</p>
          </PageContainer>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/moderation" element={<ModerationPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
