import styles from './Preview.module.scss'
import { ReactComponent as PlayIcon } from './play.svg'
import { PreviewData } from '../..'

export interface PreviewProps extends PreviewData {
  onPreviewPlay: () => void
  onPreviewResume: (value: number) => void
}

export const Preview = ({
  img,
  age,
  onPreviewPlay,
  onPreviewResume,
}: PreviewProps) => {
  const progress = Number(localStorage.getItem('progress'))
  const progresToTime = (progress: number) =>
    new Date(progress * 1000).toISOString().slice(progress > 3600 ? 11 : 14, 19)

  return (
    <div className={styles.preview}>
      <PlayIcon className={styles.play} onClick={onPreviewPlay} />
      {!!progress && (
        <div
          className={styles.resume}
          onClick={() => onPreviewResume(progress)}>
          Продолжить просмотр c {progresToTime(progress)}
        </div>
      )}
      <div className={styles.age}>{age}+</div>
      <img className={styles.background} src={img} alt='Preview' />
    </div>
  )
}
