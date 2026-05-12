import json
from pathlib import Path

CHAT_LOG = Path(__file__).parent / "chat_log.json"

with open(CHAT_LOG, 'r', encoding='utf-8') as f:
    history = json.load(f)

# Убираем последовательные дубликаты
cleaned = []
for msg in history:
    if cleaned and cleaned[-1]["role"] == msg["role"] and cleaned[-1]["content"] == msg["content"]:
        continue
    cleaned.append(msg)

duplicates_removed = len(history) - len(cleaned)

with open(CHAT_LOG, 'w', encoding='utf-8') as f:
    json.dump(cleaned, f, ensure_ascii=False, indent=2)

print(f"🧹 Очистка завершена!")
print(f"   Удалено дубликатов: {duplicates_removed}")
print(f"   Сообщений до: {len(history)}")
print(f"   Сообщений после: {len(cleaned)}")