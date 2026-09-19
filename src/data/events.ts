import type { Event } from "../types/event";

export const events: Event[] = [
  {
    id: 1,
    title: "Группа «Север»",
    date: "20 апреля",
    day: "СБ",
    time: "19:00",
    place: "Клуб «Космонавт»",
    address: "Санкт-Петербург, Бронницкая ул., 24",
    category: "Концерты",
    description:
      "Большой весенний концерт с живой музыкой, любимыми хитами и новыми песнями.",
    posterClass: "poster-concert",
  },
  {
    id: 2,
    title: "Внутри красоты",
    date: "5 апреля",
    day: "СБ",
    time: "12:00",
    place: "Центр современного искусства «Заря»",
    address: "Москва, ул. Сходненская, 10",
    category: "Выставки",
    description:
      "Выставка современного искусства, в которой классические образы встречаются с новым визуальным языком.",
    posterClass: "poster-art",
  },
  {
    id: 3,
    title: "Tech People Meetup",
    date: "26 апреля",
    day: "СБ",
    time: "18:30",
    place: "Коворкинг «Практик»",
    address: "Москва, ул. Тимура Фрунзе, 11",
    category: "IT и технологии",
    description:
      "Встреча людей, идей и технологий для тех, кто создаёт цифровые продукты.",
    posterClass: "poster-tech",
  },
];
