export type Message = {
  id: number
  text: string
  time: string
  out: boolean
  read?: boolean
}

export type Chat = {
  id: number
  name: string
  preview: string
  time?: string
  fallback: string
  status: string
  messages: Message[]
}

export const chats: Chat[] = [
  {
    id: 1,
    name: 'Безопасность',
    preview:
      'Новый вход. Обнаружили вход в профиль с нового устройства. Установите пароль для входа — без него войти на этом устройстве не получится.',
    time: '20:49',
    fallback: 'Б',
    status: 'Был(-а) недавно',
    messages: [
      {
        id: 1,
        text: 'Новый вход. Обнаружили вход в профиль с нового устройства. Установите пароль для входа — без него войти на этом устройстве не получится.',
        time: '20:49',
        out: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Алексей',
    preview: 'Ты уже посмотрел документы?',
    time: '20:05',
    fallback: 'А',
    status: 'Был(-а) недавно',
    messages: [
      { id: 1, text: 'Привет!', time: '18:55', out: true, read: true },
      {
        id: 2,
        text: 'Можем созвониться вечером? Хочу обсудить план на неделю',
        time: '18:57',
        out: true,
        read: true,
      },
      { id: 3, text: 'Давай)', time: '18:57', out: false },
      { id: 4, text: 'Ты уже посмотрел документы?', time: '20:05', out: false },
    ],
  },
]

export function findChat(id: string | undefined) {
  const chatId = Number(id)
  if (!Number.isInteger(chatId)) return undefined
  return chats.find((chat) => chat.id === chatId)
}
