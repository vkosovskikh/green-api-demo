import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './TextField.module.css'

type TextFieldProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'password'
  placeholder?: string
  autoComplete?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  name?: string
  prefix?: ReactNode
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, value, onChange, type = 'text', placeholder, autoComplete, inputMode, name, prefix },
  ref,
) {
  return (
    <label className={styles.control}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.field}>
        {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
        <input
          ref={ref}
          className={styles.input}
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  )
})
