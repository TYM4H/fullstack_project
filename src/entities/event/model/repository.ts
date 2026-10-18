import { demoEvents } from "./demo-events";
import {
  categories,
  type Event,
  type EventDraft,
  type EventStatus,
} from "./types";
import type { Ticket } from "../../ticket/types";

export const storageKey = "afisha:demo:v1";
type Database = { version: 1; events: Event[]; tickets: Ticket[] };
export type LoadMode = "normal" | "empty" | "error";
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 400));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function isEvent(value: unknown): value is Event {
  if (!isRecord(value)) return false;
  return (
    [
      "id",
      "title",
      "startsAt",
      "place",
      "address",
      "description",
      "posterClass",
    ].every((key) => typeof value[key] === "string" && value[key].length > 0) &&
    Number.isFinite(Date.parse(String(value.startsAt))) &&
    categories.some((category) => category === value.category) &&
    ["pending", "published", "rejected"].includes(String(value.status)) &&
    (value.posterUrl === undefined ||
      (typeof value.posterUrl === "string" &&
        /^data:image\/(png|jpeg|webp);base64,/.test(value.posterUrl))) &&
    (value.rejectionReason === undefined ||
      typeof value.rejectionReason === "string")
  );
}
function isTicket(value: unknown): value is Ticket {
  if (!isRecord(value) || !isRecord(value.event)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.eventId === "string" &&
    typeof value.issuedAt === "string" &&
    Number.isFinite(Date.parse(value.issuedAt)) &&
    ["title", "startsAt", "place", "address", "posterClass"].every(
      (key) =>
        typeof (value.event as Record<string, unknown>)[key] === "string",
    ) &&
    Number.isFinite(Date.parse(String(value.event.startsAt)))
  );
}
function read(): Database {
  let raw: string | null;
  try {
    raw = localStorage.getItem(storageKey);
  } catch {
    throw new Error(
      "Браузер запретил доступ к локальному хранилищу. Разрешите сохранение данных и повторите загрузку.",
    );
  }
  if (raw === null)
    return { version: 1, events: structuredClone(demoEvents), tickets: [] };
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error(
      "Сохранённые данные повреждены. Очистите данные этого сайта в настройках браузера, чтобы начать заново.",
    );
  }
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !Array.isArray(value.events) ||
    !value.events.every(isEvent) ||
    !Array.isArray(value.tickets) ||
    !value.tickets.every(isTicket)
  ) {
    throw new Error(
      "Формат сохранённых данных не поддерживается. Очистите данные этого сайта в настройках браузера.",
    );
  }
  return value as Database;
}
function write(database: Database) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(database));
  } catch {
    throw new Error(
      "Не удалось сохранить данные в браузере. Возможно, хранилище заполнено или недоступно. Попробуйте афишу меньшего размера.",
    );
  }
}
export const eventRepository = {
  async load(mode: LoadMode = "normal"): Promise<Database> {
    await wait();
    if (mode === "error")
      throw new Error(
        "Демонстрационная ошибка загрузки. Нажмите «Повторить загрузку» для восстановления.",
      );
    const database = read();
    return mode === "empty"
      ? { ...database, events: [], tickets: [] }
      : database;
  },
  async create(draft: EventDraft): Promise<Database> {
    await wait();
    const database = read();
    database.events.push({
      ...draft,
      id: crypto.randomUUID(),
      status: "pending",
    });
    write(database);
    return database;
  },
  async moderate(
    id: string,
    status: Exclude<EventStatus, "pending">,
    reason?: string,
  ): Promise<Database> {
    await wait();
    const database = read();
    const event = database.events.find((event) => event.id === id);
    if (!event || event.status !== "pending")
      throw new Error(
        "Событие уже обработано или не найдено. Обновите список.",
      );
    if (status === "rejected" && (!reason || reason.trim().length < 5))
      throw new Error("Укажите причину отклонения: минимум 5 символов.");
    event.status = status;
    event.rejectionReason = status === "rejected" ? reason?.trim() : undefined;
    write(database);
    return database;
  },
  async issueTicket(
    eventId: string,
  ): Promise<{ database: Database; ticket: Ticket }> {
    await wait();
    const database = read();
    const event = database.events.find(
      (event) => event.id === eventId && event.status === "published",
    );
    if (!event)
      throw new Error("Билет доступен только для опубликованного события.");
    const existing = database.tickets.find(
      (ticket) => ticket.eventId === eventId,
    );
    if (existing) return { database, ticket: existing };
    const { title, startsAt, place, address, posterClass } = event;
    const ticket: Ticket = {
      id: crypto.randomUUID(),
      eventId,
      issuedAt: new Date().toISOString(),
      event: { title, startsAt, place, address, posterClass },
    };
    database.tickets.push(ticket);
    write(database);
    return { database, ticket };
  },
};
