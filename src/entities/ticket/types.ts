import type { Event } from "../event/model/types";

export type Ticket = {
  id: string;
  eventId: string;
  issuedAt: string;
  event: Pick<
    Event,
    "title" | "startsAt" | "place" | "address" | "posterClass"
  >;
};
