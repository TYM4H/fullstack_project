import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EventPage } from "./pages/EventPage";
import { HomePage } from "./pages/HomePage";
import { ModerationPage } from "./pages/ModerationPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TicketPage } from "./pages/TicketPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/moderation" element={<ModerationPage />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
