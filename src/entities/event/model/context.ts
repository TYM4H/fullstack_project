import { createContext, useContext } from "react";
import type { Event, EventDraft, EventStatus } from "./types";
import type { Ticket } from "../../ticket/types";

export type EventsState = {
  events: Event[];
  tickets: Ticket[];
  status: "loading" | "success" | "error";
  error: string;
  reload: () => Promise<void>;
  createEvent: (draft: EventDraft) => Promise<void>;
  moderateEvent: (
    id: string,
    status: Exclude<EventStatus, "pending">,
    reason?: string,
  ) => Promise<void>;
  issueTicket: (eventId: string) => Promise<Ticket>;
};
export const EventsContext = createContext<EventsState | null>(null);
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context)
    throw new Error("useEvents должен использоваться внутри EventsProvider");
  return context;
}
