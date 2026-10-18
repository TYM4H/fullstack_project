import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EventsContext } from "../../entities/event/model/context";
import { eventRepository } from "../../entities/event/model/repository";
import type {
  Event,
  EventDraft,
  EventStatus,
} from "../../entities/event/model/types";
import type { Ticket } from "../../entities/ticket/types";
import { errorMessage } from "../../shared/lib/errors";

export function EventsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<{ events: Event[]; tickets: Ticket[] }>({
    events: [],
    tickets: [],
  });
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const request = useRef(0);
  const reload = useCallback(async () => {
    const current = ++request.current;
    setStatus("loading");
    setError("");
    try {
      const database = await eventRepository.load();
      if (current === request.current) {
        setData(database);
        setStatus("success");
      }
    } catch (error) {
      if (current === request.current) {
        setError(errorMessage(error));
        setStatus("error");
      }
    }
  }, []);
  useEffect(() => {
    const current = ++request.current;
    // Начальное состояние уже loading. Ответ устаревшего запроса игнорируется.
    void eventRepository
      .load()
      .then((database) => {
        if (current === request.current) {
          setData(database);
          setStatus("success");
        }
      })
      .catch((error: unknown) => {
        if (current === request.current) {
          setError(errorMessage(error));
          setStatus("error");
        }
      });
    return () => {
      request.current += 1;
    };
  }, []);
  const apply = (database: { events: Event[]; tickets: Ticket[] }) => {
    request.current += 1;
    setData(database);
    setError("");
    setStatus("success");
  };
  const createEvent = async (draft: EventDraft) =>
    apply(await eventRepository.create(draft));
  const moderateEvent = async (
    id: string,
    status: Exclude<EventStatus, "pending">,
    reason?: string,
  ) => apply(await eventRepository.moderate(id, status, reason));
  const issueTicket = async (eventId: string) => {
    const { database, ticket } = await eventRepository.issueTicket(eventId);
    apply(database);
    return ticket;
  };
  return (
    <EventsContext.Provider
      value={{
        ...data,
        status,
        error,
        reload,
        createEvent,
        moderateEvent,
        issueTicket,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}
