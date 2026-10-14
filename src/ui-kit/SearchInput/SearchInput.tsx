import styles from './SearchInput.module.css'

type SearchInputProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchInput({ placeholder, value, onChange }: SearchInputProps) {
  return (
    <div className={styles.input}>
      <input
        className={styles.field}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
    </div>
  )
}
