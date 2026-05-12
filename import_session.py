import json
from pathlib import Path

CHAT_LOG = Path(__file__).parent / "chat_log.json"

history = []
if CHAT_LOG.exists():
    with open(CHAT_LOG, 'r', encoding='utf-8') as f:
        history = json.load(f)

web_session = [
    {"role": "user", "content": "Привет! проверим, можешь ди ты присоединиться к группе. [ссылка]"},
    {"role": "assistant", "content": "[Не могу открыть ссылку]"},
    {"role": "user", "content": "я сделал фото для панорамы, а как тебе его передать не знаю."},
    {"role": "assistant", "content": "[Предложил способы передачи]"},
    {"role": "user", "content": "[Скриншоты, попытки загрузки фото]"},
    {"role": "assistant", "content": "[Помогал с загрузкой]"},
    {"role": "user", "content": "https://disk.yandex.ru/i/52N9ehYrLHj4ng"},
    {"role": "assistant", "content": "[Не могу открыть]"},
    {"role": "user", "content": "[Скриншот файлового менеджера]"},
    {"role": "assistant", "content": "[Не вижу панораму, предложил Imgur]"},
    {"role": "user", "content": "https://i.imgur.com/rxjOas0.png"},
    {"role": "assistant", "content": "[Увидел ссылку, предложил использовать как текстуру]"},
    {"role": "user", "content": "Ок, запомни эту ссылку, т.к. фото там специально сделано и убраны швы, для создания панорамы 360. Я буду позже, доделаем."},
    {"role": "assistant", "content": "Запомнил ссылку."},
    {"role": "user", "content": "[Загрузил файлы памяти]"},
    {"role": "user", "content": "Привет! Делаем панораму и пробуем потом текстуры"},
    {"role": "assistant", "content": "[Интегрировал панораму в QASAR]"},
    {"role": "user", "content": "[Скриншоты] Панорама размыта и ничего не видно"},
    {"role": "assistant", "content": "[Приблизил панораму]"},
    {"role": "user", "content": "[Скриншоты] Панорама растянута, шов видно"},
    {"role": "assistant", "content": "[Повернул панораму, сгладил швы]"},
    {"role": "user", "content": "[Обсуждение графического интерфейса, промты для Шедеврума]"},
    {"role": "assistant", "content": "[Создал HUD, промты для генерации]"},
    {"role": "user", "content": "[Скриншоты] Худ не на месте, развёрнут не туда"},
    {"role": "assistant", "content": "[Многочисленные попытки разместить HUD]"},
    {"role": "user", "content": "[Скриншоты из Blender, обсуждение геометрии проёма]"},
    {"role": "assistant", "content": "[Пытался вычислить координаты]"},
    {"role": "user", "content": "дай мне скрипт для блендер, измерения стен. потолка. пола, проёмов и я сделал худ и разместил его."},
    {"role": "assistant", "content": "[Дал Blender-скрипт]"},
    {"role": "user", "content": "[qasar_full_report.json — есть объект Hud]"},
    {"role": "assistant", "content": "[Взял точные координаты из Blender]"},
    {"role": "user", "content": "[Скриншоты] сдвинь параллельно во внутрь, на такое же расстояние."},
    {"role": "assistant", "content": "[Двигали HUD внутрь: -30см, -50см, -60см]"},
    {"role": "user", "content": "Всё! Встало отлично! Теперь у тебя на худе и сзади тоже есть картинка... и надо бы у худа заднюю часть затенить изнутри. А картинку сзади убрать."},
    {"role": "assistant", "content": "[Убрал DoubleSide, добавил подложку]"},
    {"role": "user", "content": "фризит есть мерцание."},
    {"role": "assistant", "content": "[Убрал подложку, сделал фон на canvas]"},
    {"role": "user", "content": "Отлично! А часы можно сделать интерактивные и привязанными ко времени на пк у юзера?"},
    {"role": "assistant", "content": "[Сделал часы в реальном времени]"},
    {"role": "user", "content": "а дата тоже синхронизирована?"},
    {"role": "assistant", "content": "[Подтвердил]"},
    {"role": "user", "content": "Ты Молодец! Всё работает на отлично! Фиксируем версию и присваиваем ей имя. Это эталон. Его нужно как то запомнить в данных. Допустим версия релиз 0.1"},
    {"role": "assistant", "content": "[Зафиксировал QASAR v0.1]"},
    {"role": "user", "content": "да, обновляем, всё сохраняем и отдых."},
    {"role": "assistant", "content": "[Обновил project_context.txt]"},
    {"role": "user", "content": "А общее сохранение по промту забыл?"},
    {"role": "assistant", "content": "[Напомнил про комплект сохранения]"},
    {"role": "user", "content": "да и как сохранить скажи"},
    {"role": "assistant", "content": "[Дал import_session.py и инструкцию]"},
    {"role": "user", "content": "у тебя не вся ссесия тут"},
    {"role": "assistant", "content": "[Объяснил ограничение]"},
    {"role": "user", "content": "давай как делали раньше, сегодняшний день весь добавляем к старым. чистим и обновляем без потерь."},
]

# Защита от дубликатов
existing = {(m["role"], m["content"]) for m in history}
new_msgs = [m for m in web_session if (m["role"], m["content"]) not in existing]
history.extend(new_msgs)

with open(CHAT_LOG, 'w', encoding='utf-8') as f:
    json.dump(history, f, ensure_ascii=False, indent=2)

print(f"✅ Добавлено новых сообщений: {len(new_msgs)}")
print(f"📝 Всего в истории: {len(history)}")