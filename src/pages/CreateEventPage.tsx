import { CreateEventForm } from "../features/create-event/CreateEventForm";
import { PageContainer } from "../shared/ui/PageContainer";

export function CreateEventPage() {
  return (
    <PageContainer>
      <div className="page-heading">
        <p className="eyebrow">НОВОЕ СОБЫТИЕ</p>
        <h1>Создайте событие из афиши</h1>
        <p className="lead">
          Загрузите изображение и заполните данные перед отправкой на проверку.
        </p>
      </div>
      <ol className="steps">
        <li>Добавьте афишу</li>
        <li>Заполните данные</li>
        <li>Отправьте на проверку</li>
      </ol>
      <CreateEventForm />
    </PageContainer>
  );
}
