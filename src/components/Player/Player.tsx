import { useState } from 'react'
import styles from './Player.module.scss'

import { Preview } from './Preview/Preview'
import { Video } from './Video/Video'

export interface PreviewData {
  img: string
  age: number
}

export interface PlayerProps {
  preview: PreviewData
  src: string
}

export const Player = ({ preview, src }: PlayerProps) => {
  const [isPreview, setIsPreview] = useState(true)
  const [resumedTime, setResumedTime] = useState(0)

  return (
    <div className={styles.player}>
      {isPreview ? (
        <Preview
          {...preview}
          onPreviewPlay={() => setIsPreview(false)}
          onPreviewResume={(value: number) => {
            setIsPreview(false)
            setResumedTime(value)
          }}
        />
      ) : (
        <Video src={src} resumedTime={resumedTime} />
      )}
    </div>
  )
}
