import { useEffect, useRef } from 'react'
import { StatusDeliveredIcon, StatusReadIcon } from '../../assets/icons'
import type { Message } from '../../data/chats'
import styles from './ChatView.module.css'

type MessageListProps = {
  messages: Message[]
}

type Place = 'single' | 'first' | 'middle' | 'last'

function placeOf(messages: Message[], index: number): Place {
  const current = messages[index]
  const prevSame = messages[index - 1]?.out === current.out
  const nextSame = messages[index + 1]?.out === current.out
  if (prevSame && nextSame) return 'middle'
  if (nextSame) return 'first'
  if (prevSame) return 'last'
  return 'single'
}

export function MessageList({ messages }: MessageListProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollTop = scroller.scrollHeight
  }, [messages])

  return (
    <div className={styles.history} ref={scrollerRef}>
      <div className={styles.historyInner}>
        {messages.map((message, index) => {
          const place = placeOf(messages, index)
          const side = message.out ? styles.out : styles.in
          return (
            <div key={message.id} className={`${styles.row} ${side} ${styles[place]}`}>
              <div className={styles.bubble}>
                <span className={styles.text}>{message.text}</span>
                <span className={styles.meta}>
                  {message.time}
                  {message.out ? (
                    message.read ? <StatusReadIcon /> : <StatusDeliveredIcon />
                  ) : null}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
