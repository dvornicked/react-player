import dashjs, { BitrateInfo } from 'dashjs'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Spinner } from '../..'
import styles from './Video.module.scss'

interface VideoProps {
  src: string
  resumedTime: number
}

export const Video = ({ src, resumedTime }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<dashjs.MediaPlayerClass>()
  const [canPlay, setCanPlay] = useState(false)
  const [bitrateList, setBitrateList] = useState<BitrateInfo[]>([])

  // -1 is Auto; 0-Infinite - defined value
  const [currentQuality, setCurrentQuality] = useState<number>(-1)
  // -1 is not initialized; 0-Infinite - defined value
  const [autoQuality, setAutoQuality] = useState(-1)

  const onChangeBitrate = (event: ChangeEvent<HTMLSelectElement>) => {
    const level = Number(event.target.value)
    const settings: dashjs.MediaPlayerSettingClass = {
      streaming: {
        abr: {
          autoSwitchBitrate: {
            video: level === -1,
          },
        },
      },
    }
    playerRef.current?.updateSettings(settings)
    playerRef.current?.setQualityFor('video', level, true)
    setCurrentQuality(level)
  }

  useEffect(() => {
    const video = videoRef.current
    console.log(video)
    if (!video) return

    const player = dashjs.MediaPlayer().create()

    player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      if (resumedTime && videoRef.current) videoRef.current.currentTime = resumedTime
      setBitrateList(player.getBitrateInfoListFor('video'))
    })

    player.on(dashjs.MediaPlayer.events.CAN_PLAY, () => setCanPlay(true))
    player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, () => localStorage.removeItem('progress'))

    player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, e => {
      if (currentQuality === -1) {
        setAutoQuality(e.newQuality)
      }
    })

    player.on(dashjs.MediaPlayer.events.PLAYBACK_PROGRESS, () =>
      localStorage.setItem(
        'progress',
        Math.floor(videoRef.current?.currentTime!).toString()
      )
    )

    player.initialize(video, src, false)
    playerRef.current = player
  }, [])

  return (
    <>
      <video
        className={cn(styles.video, {
          [styles.hidden]: !canPlay,
        })}
        autoPlay
        controls
        ref={videoRef}
      />
      <Spinner
        className={cn(styles.video, {
          [styles.hidden]: canPlay,
        })}
      />
    </>
  )
}
