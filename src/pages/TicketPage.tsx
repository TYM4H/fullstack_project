import { Button } from "@mui/material";
import { PageContainer } from "../components/PageContainer";

export function TicketPage() {
  return (
    <PageContainer>
      <div className="ticket-layout">
        <article className="ticket">
          <div className="ticket-top poster-concert">
            <span>МУЗЫКА · ЛЮДИ · БЛИЖЕ</span>
            <strong>
              ГРУППА
              <br />
              «СЕВЕР»
            </strong>
          </div>
          <div className="ticket-info">
            <h1>Группа «Север»</h1>
            <p>20 апреля, суббота · 19:00</p>
            <p>Клуб «Космонавт»</p>
          </div>
          <div className="ticket-bottom">
            <div>
              <span>Номер билета</span>
              <b>AF-2048-19</b>
              <small>Стандартный входной билет</small>
            </div>
            <div className="qr-code" aria-label="Демонстрационный QR-код"></div>
          </div>
        </article>
        <aside className="ticket-help">
          <span className="success-icon">Готово</span>
          <h1>Билет оформлен!</h1>
          <b className="paid">Оплата подтверждена</b>
          <p>
            Сохраните билет на телефон или распечатайте его перед мероприятием.
          </p>
          <div className="how-to">
            <h2>Как пройти на мероприятие</h2>
            <p>1. Покажите QR-код на входе.</p>
            <p>2. Код будет отсканирован сотрудником.</p>
            <p>3. Приходите за 30 минут до начала.</p>
          </div>
          <Button variant="outlined" fullWidth>
            Скачать билет
          </Button>
        </aside>
      </div>
    </PageContainer>
  );
}
