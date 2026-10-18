import { Alert, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../entities/event/model/context";
import { errorMessage } from "../../shared/lib/errors";

export function IssueTicketButton({ eventId }: { eventId: string }) {
  const { issueTicket } = useEvents();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function issue() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const ticket = await issueTicket(eventId);
      navigate(`/ticket?ticketId=${ticket.id}`);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        onClick={() => void issue()}
        disabled={busy}
        variant="contained"
        fullWidth
      >
        {busy ? "Оформляем…" : "Получить билет"}
      </Button>
    </>
  );
}
