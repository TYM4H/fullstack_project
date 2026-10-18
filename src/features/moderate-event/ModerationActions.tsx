import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useEvents } from "../../entities/event/model/context";
import { errorMessage } from "../../shared/lib/errors";

export function ModerationActions({
  eventId,
  title,
  onSuccess,
}: {
  eventId: string;
  title: string;
  onSuccess: (message: string) => void;
}) {
  const { moderateEvent } = useEvents();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(status: "published" | "rejected") {
    if (busy) return;
    if (
      status === "rejected" &&
      (reason.trim().length < 5 || reason.trim().length > 500)
    ) {
      setReasonError("Введите от 5 до 500 символов.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await moderateEvent(eventId, status, reason);
      setOpen(false);
      onSuccess(
        status === "published"
          ? `«${title}» опубликовано и доступно в афише.`
          : `«${title}» отклонено. Причина сохранена.`,
      );
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="moderation-actions">
      <Button
        onClick={() => void submit("published")}
        disabled={busy}
        variant="contained"
      >
        {busy ? "Сохраняем…" : "Одобрить"}
      </Button>
      <Button
        onClick={() => {
          setOpen(true);
          setError("");
        }}
        disabled={busy}
        color="error"
      >
        Отклонить
      </Button>
      {error && !open && <Alert severity="error">{error}</Alert>}
      <Dialog
        open={open}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
        fullWidth
        maxWidth="sm"
        aria-labelledby={`reject-${eventId}`}
      >
        <DialogTitle id={`reject-${eventId}`}>
          Отклонить событие «{title}»?
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            label="Причина отклонения"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setReasonError("");
            }}
            error={Boolean(reasonError)}
            helperText={
              reasonError ||
              "Объясните, что нужно исправить. От 5 до 500 символов."
            }
            multiline
            minRows={3}
            fullWidth
            disabled={busy}
            margin="dense"
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={busy}>
            Отмена
          </Button>
          <Button
            onClick={() => void submit("rejected")}
            color="error"
            variant="contained"
            disabled={busy}
          >
            {busy ? "Сохраняем…" : "Подтвердить отклонение"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
