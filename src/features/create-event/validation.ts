import {
  categories,
  type Category,
  type EventDraft,
} from "../../entities/event/model/types";

export type EventFormValues = {
  title: string;
  date: string;
  time: string;
  place: string;
  address: string;
  category: Category | "";
  description: string;
};
export type FormErrors = Partial<Record<keyof EventFormValues, string>>;
export const initialValues: EventFormValues = {
  title: "",
  date: "",
  time: "",
  place: "",
  address: "",
  category: "",
  description: "",
};

export function validateEvent(
  values: EventFormValues,
  now = Date.now(),
): FormErrors {
  const errors: FormErrors = {};
  const lengths = {
    title: [3, 200],
    place: [3, 200],
    address: [5, 300],
    description: [20, 3000],
  } as const;
  for (const key of Object.keys(lengths) as (keyof typeof lengths)[]) {
    const [min, max] = lengths[key];
    if (values[key].trim().length < min || values[key].trim().length > max)
      errors[key] = `Введите от ${min} до ${max} символов.`;
  }
  if (!categories.some((category) => category === values.category))
    errors.category = "Выберите категорию.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) errors.date = "Укажите дату.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time))
    errors.time = "Укажите время.";
  if (!errors.date && !errors.time) {
    const startsAt = new Date(`${values.date}T${values.time}:00+03:00`);
    // Обратное преобразование выявляет несуществующие даты, например 31 февраля.
    if (
      !Number.isFinite(startsAt.getTime()) ||
      new Date(startsAt.getTime() + 3 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10) !== values.date
    )
      errors.date = "Укажите существующую дату.";
    else if (startsAt.getTime() <= now)
      errors.date = "Событие должно начинаться в будущем (время Москвы).";
  }
  return errors;
}
export function toEventDraft(
  values: EventFormValues,
  posterUrl?: string,
): EventDraft {
  return {
    title: values.title.trim(),
    startsAt: new Date(`${values.date}T${values.time}:00+03:00`).toISOString(),
    place: values.place.trim(),
    address: values.address.trim(),
    category: values.category as Category,
    description: values.description.trim(),
    posterUrl,
    posterClass:
      values.category === "Выставки"
        ? "poster-art"
        : values.category === "IT и технологии"
          ? "poster-tech"
          : "poster-concert",
  };
}
export function validatePoster(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "Выберите изображение JPG, PNG или WebP.";
  if (file.size > 2 * 1024 * 1024)
    return "Размер афиши не должен превышать 2 МБ.";
  return "";
}
