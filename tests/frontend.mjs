import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";
const baseURL = process.env.BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "ru-RU",
  timezoneId: "Europe/Moscow",
});
const page = await context.newPage();
page.setDefaultTimeout(10000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const screenshotDirectory = path.resolve("docs/screenshots");
const updateScreenshots = process.env.UPDATE_SCREENSHOTS === "1";
if (updateScreenshots) await mkdir(screenshotDirectory, { recursive: true });
let passed = 0;
async function check(name, action) {
  await action();
  passed += 1;
  console.log(`OK ${passed}. ${name}`);
}
async function visible(text) {
  await page
    .getByText(text, { exact: true })
    .first()
    .waitFor({ state: "visible" });
}
async function shot(name) {
  if (!updateScreenshots) return;
  await page.screenshot({
    path: path.join(screenshotDirectory, `${name}.png`),
    fullPage: true,
    animations: "disabled",
  });
}
async function cardCount(count) {
  await page.waitForFunction(
    (count) => document.querySelectorAll(".event-card").length === count,
    count,
  );
}
async function go(url) {
  await page.goto(`${baseURL}${url}`);
}
const title = "Открытая встреча разработчиков";
const future = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
let eventURL;
let ticketURL;
try {
  await check(
    "Загрузка, три опубликованных события и главная страница",
    async () => {
      await go("/");
      await visible("Загружаем данные…");
      await cardCount(3);
      await shot("home-page");
    },
  );
  await check(
    "Поиск без учёта регистра, фильтр категории и сохранение запроса в URL",
    async () => {
      await page.getByRole("searchbox").fill("сЕвЕр");
      await cardCount(1);
      assert.match(page.url(), /q=/);
      await page.reload();
      await cardCount(1);
      await page.getByRole("button", { name: "Сбросить фильтры" }).click();
      await cardCount(3);
      await page
        .getByRole("button", { name: "IT и технологии", exact: true })
        .click();
      await cardCount(1);
      await visible("Tech People Meetup");
      await page.getByRole("button", { name: "Сбросить фильтры" }).click();
      await page.getByRole("searchbox").fill("Несуществующее событие");
      await visible("События не найдены");
      await shot("empty-state");
      await page.getByRole("button", { name: "Сбросить фильтры" }).click();
    },
  );
  await check(
    "Демонстрация пустого списка, ошибки и восстановления данных",
    async () => {
      await page
        .getByText("Демонстрация состояний данных", { exact: true })
        .click();
      await page
        .getByRole("button", { name: "Пустой список", exact: true })
        .click();
      await visible("События не найдены");
      await page
        .getByRole("button", { name: "Ошибка загрузки", exact: true })
        .click();
      await page.getByRole("button", { name: "Повторить загрузку" }).waitFor();
      await shot("error-state");
      await page.getByRole("button", { name: "Повторить загрузку" }).click();
      await cardCount(3);
    },
  );
  await check("Обязательные поля, пробелы и прошедшая дата", async () => {
    await page.getByRole("link", { name: "Создать", exact: true }).click();
    await page.getByRole("button", { name: "Отправить на модерацию" }).click();
    await visible("Укажите дату.");
    await visible("Выберите категорию.");
    assert.equal(
      await page.locator('[name="title"]').getAttribute("aria-invalid"),
      "true",
    );
    await shot("form-validation");
    await page.getByRole("textbox", { name: "Название события" }).fill("   ");
    await page.locator('[name="date"]').fill("2020-01-01");
    await page.locator('[name="time"]').fill("19:30");
    await page.getByRole("button", { name: "Отправить на модерацию" }).click();
    await visible("Событие должно начинаться в будущем (время Москвы).");
  });
  await check(
    "Проверка типа, размера и содержимого афиши; предпросмотр и удаление",
    async () => {
      const input = page.locator('input[type="file"]');
      await input.setInputFiles({
        name: "poster.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("pdf"),
      });
      await visible("Выберите изображение JPG, PNG или WebP.");
      await input.setInputFiles({
        name: "big.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(2 * 1024 * 1024 + 1),
      });
      await visible("Размер афиши не должен превышать 2 МБ.");
      await input.setInputFiles({
        name: "broken.png",
        mimeType: "image/png",
        buffer: Buffer.from("broken image"),
      });
      await visible("Файл не является корректным изображением.");
      const png = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5XkAAAAASUVORK5CYII=",
        "base64",
      );
      await input.setInputFiles({
        name: "poster.png",
        mimeType: "image/png",
        buffer: png,
      });
      await visible("Афиша загружена");
      await page.getByRole("button", { name: "Удалить афишу" }).click();
      await visible("Добавьте афишу");
      await input.setInputFiles(path.resolve("src/assets/hero.png"));
      await visible("Афиша загружена");
    },
  );
  await check(
    "Заполнение формы и обработка отказа localStorage без потери ввода",
    async () => {
      await page.getByRole("textbox", { name: "Название события" }).fill(title);
      await page.locator('[name="date"]').fill(future);
      await page.getByRole("combobox", { name: "Категория" }).click();
      await page.getByRole("option", { name: "IT и технологии" }).click();
      await page
        .getByRole("textbox", { name: "Место проведения" })
        .fill("Коворкинг «Практик»");
      await page
        .getByRole("textbox", { name: "Адрес", exact: false })
        .fill("Москва, ул. Тимура Фрунзе, 11");
      await page
        .getByRole("textbox", { name: "Описание" })
        .fill(
          "Открытая встреча о React и TypeScript: короткие доклады, демонстрации проектов и обсуждение архитектуры frontend.",
        );
      await shot("create-event-page");
      await page.evaluate(() => {
        window.restoreSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = () => {
          throw new DOMException("Quota exceeded", "QuotaExceededError");
        };
      });
      await page
        .getByRole("button", { name: "Отправить на модерацию" })
        .click();
      await page
        .getByRole("alert")
        .filter({ hasText: "Не удалось сохранить данные" })
        .waitFor();
      assert.equal(
        await page
          .getByRole("textbox", { name: "Название события" })
          .inputValue(),
        title,
      );
      await page.evaluate(() => {
        Storage.prototype.setItem = window.restoreSetItem;
        delete window.restoreSetItem;
      });
      await page
        .getByRole("button", { name: "Отправить на модерацию" })
        .click();
      await visible("Событие отправлено на модерацию");
      await shot("create-success");
    },
  );
  await check(
    "Новое событие сохраняется после перезагрузки и скрыто из публичной афиши",
    async () => {
      await go("/");
      await cardCount(3);
      await page.getByRole("searchbox").fill(title);
      await visible("События не найдены");
      await page.getByRole("link", { name: "Модерация", exact: true }).click();
      await page.getByRole("heading", { name: title, exact: true }).waitFor();
      await page.reload();
      await page.getByRole("heading", { name: title, exact: true }).waitFor();
      assert.equal(await page.locator(".moderation-item").count(), 3);
      await shot("moderation-page");
    },
  );
  await check("Одобрение публикует событие и обновляет счётчики", async () => {
    const row = page
      .locator(".moderation-item")
      .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
    await row.getByRole("button", { name: "Одобрить", exact: true }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "опубликовано и доступно" })
      .waitFor();
    await page.getByRole("tab", { name: "Опубликовано", exact: true }).click();
    const published = page
      .locator(".moderation-item")
      .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
    await published.waitFor();
    assert.equal(await page.locator(".moderation-item").count(), 4);
    await published.getByRole("link", { name: "Посмотреть событие" }).click();
    eventURL = new URL(page.url()).pathname;
    await page.getByRole("button", { name: "Получить билет" }).waitFor();
    await shot("event-details-page");
  });
  await check(
    "Билет соответствует событию, сохраняется и скачивается",
    async () => {
      await page.getByRole("button", { name: "Получить билет" }).click();
      await visible("Билет оформлен!");
      ticketURL = page.url();
      assert.equal(await page.locator(".ticket-info h1").textContent(), title);
      await page.reload();
      await visible("Билет оформлен!");
      await shot("ticket-page");
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Скачать билет (.txt)" }).click();
      const download = await downloadPromise;
      const content = await readFile(await download.path(), "utf8");
      assert.ok(content.includes(title));
      assert.ok(content.includes("19:30 МСК"));
      await page.getByRole("link", { name: "← К событию" }).click();
      await page.getByRole("button", { name: "Получить билет" }).click();
      await visible("Билет оформлен!");
      assert.equal(page.url(), ticketURL);
      await page.emulateMedia({ media: "print" });
      assert.equal(await page.locator(".ticket-help").isVisible(), false);
      assert.equal(await page.locator(".ticket").isVisible(), true);
      await page.emulateMedia({ media: "screen" });
    },
  );
  await check(
    "Отклонение: отмена, обязательная причина и сохранение результата",
    async () => {
      await go("/moderation");
      const row = page
        .locator(".moderation-item")
        .filter({ hasText: "Город и его истории" });
      await row.getByRole("button", { name: "Отклонить", exact: true }).click();
      await page.getByRole("button", { name: "Отмена", exact: true }).click();
      await row.getByRole("button", { name: "Отклонить", exact: true }).click();
      await page
        .getByRole("button", { name: "Подтвердить отклонение" })
        .click();
      await visible("Введите от 5 до 500 символов.");
      await page
        .getByRole("textbox", { name: "Причина отклонения" })
        .fill("Уточните адрес и программу лекции.");
      await shot("moderation-reject");
      await page
        .getByRole("button", { name: "Подтвердить отклонение" })
        .click();
      await page
        .getByRole("alert")
        .filter({ hasText: "Причина сохранена" })
        .waitFor();
      await page.getByRole("tab", { name: "Отклонено", exact: true }).click();
      await visible("Причина: Уточните адрес и программу лекции.");
      await page.reload();
      await page.getByRole("tab", { name: "Отклонено", exact: true }).click();
      await visible("Причина: Уточните адрес и программу лекции.");
    },
  );
  await check(
    "Неизвестные адреса, события и билеты; запрет билета до публикации",
    async () => {
      await go("/events/5");
      await visible("Ожидает проверки");
      assert.equal(
        await page.getByRole("button", { name: "Получить билет" }).count(),
        0,
      );
      await go("/events/missing");
      await visible("Событие не найдено");
      await go("/ticket");
      await visible("Билет не найден");
      await go("/ticket?ticketId=missing");
      await visible("Билет не найден");
      await go("/missing");
      await visible("Похоже, такой страницы нет");
      await shot("not-found-page");
    },
  );
  await check(
    "Мобильные страницы без горизонтального переполнения",
    async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      for (const [url, ready] of [
        ["/", "Афиша событий"],
        ["/create-event", "Информация о событии"],
        ["/moderation", "Модерация событий"],
        [eventURL, title],
        [
          new URL(ticketURL).pathname + new URL(ticketURL).search,
          "Билет оформлен!",
        ],
      ]) {
        await go(url);
        await page
          .getByRole("heading", { name: ready, exact: true })
          .first()
          .waitFor();
        await page
          .locator('.data-state[role="status"]')
          .filter({ hasText: "Загружаем данные" })
          .waitFor({ state: "hidden" });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
          true,
          `Переполнение на ${url}`,
        );
        if (url === "/") await shot("home-mobile");
        if (url === "/create-event") await shot("create-event-mobile");
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      assert.equal(
        await page
          .locator(".page-content")
          .evaluate((node) => getComputedStyle(node).animationName),
        "none",
      );
    },
  );
  await check(
    "Повреждённое хранилище отображает ошибку, восстановление возможно после исправления",
    async () => {
      await page.evaluate(() =>
        localStorage.setItem("afisha:demo:v1", "{broken"),
      );
      await go("/");
      await page
        .getByRole("alert")
        .filter({ hasText: "Сохранённые данные повреждены" })
        .waitFor();
      await page.evaluate(() => localStorage.removeItem("afisha:demo:v1"));
      await page.getByRole("button", { name: "Повторить загрузку" }).click();
      await cardCount(3);
    },
  );
  assert.deepEqual(errors, [], "Ошибки JavaScript в браузере");
  console.log(
    `PASS: ${passed} сценариев, ошибок JavaScript: ${errors.length}.`,
  );
} finally {
  await browser.close();
}
