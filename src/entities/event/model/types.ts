export const categories = [
  "Концерты",
  "Выставки",
  "IT и технологии",
  "Лекции",
  "Театр",
  "Фестивали",
] as const;
export type Category = (typeof categories)[number];
export type EventStatus = "pending" | "published" | "rejected";

export type Event = {
  id: string;
  title: string;
  startsAt: string;
  place: string;
  address: string;
  category: Category;
  description: string;
  status: EventStatus;
  posterClass: string;
  posterUrl?: string;
  rejectionReason?: string;
};

export type EventDraft = Omit<Event, "id" | "status" | "rejectionReason">;

export const statusLabels: Record<EventStatus, string> = {
  pending: "Ожидает проверки",
  published: "Опубликовано",
  rejected: "Отклонено",
};
