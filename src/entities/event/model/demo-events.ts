import type { Event } from "./types";

export const demoEvents: Event[] = [
  {
    id: "1",
    title: "Группа «Север»",
    startsAt: "2026-11-20T19:00:00+03:00",
    place: "Клуб «Космонавт»",
    address: "Санкт-Петербург, Бронницкая ул., 24",
    category: "Концерты",
    description:
      "Большой концерт с живой музыкой, любимыми хитами и новыми песнями.",
    posterClass: "poster-concert",
    status: "published",
  },
  {
    id: "2",
    title: "Внутри красоты",
    startsAt: "2026-11-05T12:00:00+03:00",
    place: "Центр современного искусства «Заря»",
    address: "Москва, ул. Сходненская, 10",
    category: "Выставки",
    description:
      "Выставка современного искусства, в которой классические образы встречаются с новым визуальным языком.",
    posterClass: "poster-art",
    status: "published",
  },
  {
    id: "3",
    title: "Tech People Meetup",
    startsAt: "2026-11-26T18:30:00+03:00",
    place: "Коворкинг «Практик»",
    address: "Москва, ул. Тимура Фрунзе, 11",
    category: "IT и технологии",
    description:
      "Встреча людей, идей и технологий для тех, кто создаёт цифровые продукты.",
    posterClass: "poster-tech",
    status: "published",
  },
  {
    id: "4",
    title: "Город и его истории",
    startsAt: "2026-12-12T16:00:00+03:00",
    place: "Библиотека имени Гоголя",
    address: "Санкт-Петербург, Среднеохтинский пр., 8",
    category: "Лекции",
    description:
      "Открытая лекция об архитектуре города и людях, которые изменили его облик.",
    posterClass: "poster-art",
    status: "pending",
  },
  {
    id: "5",
    title: "Зимний музыкальный вечер",
    startsAt: "2026-12-19T19:00:00+03:00",
    place: "Дом культуры",
    address: "Москва, ул. Мира, 12",
    category: "Концерты",
    description:
      "Акустические выступления молодых музыкантов и встреча с исполнителями.",
    posterClass: "poster-concert",
    status: "pending",
  },
];
