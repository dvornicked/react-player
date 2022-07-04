import { HTMLAttributes } from 'react'
import cn from 'classnames'
import styles from './Spinner.module.scss'

export const Spinner = ({className, ...props}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn(styles.spinner, className)} {...props}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

