import dashjs, { BitrateInfo } from 'dashjs'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt'
import PauseIcon from '@mui/icons-material/Pause'
import SettingsIcon from '@mui/icons-material/Settings'
import { Spinner } from '../..'
import styles from './Video.module.scss'
import { progresToTime } from '../Preview/Preview'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeDownIcon from '@mui/icons-material/VolumeDown'

interface VideoProps {
  src: string
  resumedTime: number
}

export const Video = ({ src, resumedTime }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<dashjs.MediaPlayerClass>()

  const speedValueList = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  const [currentSpeed, setCurrentSpeed] = useState<number>(1)
  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = currentSpeed
  }, [currentSpeed])

  const [canPlay, setCanPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const volumeRef = useRef<HTMLInputElement>(null)
  const onVolumeClick = () => {
    setSavedValue(+volumeRef.current!.value)
    setVolumeIconMode(0)
    volumeRef.current!.value = '0'
    videoRef.current!.muted = true
  }
  const volumeIconList = [
    <VolumeOffIcon
      onClick={() => {
        savedValue < 50 ? setVolumeIconMode(1) : setVolumeIconMode(2)
        volumeRef.current!.value = '' + savedValue
        videoRef.current!.muted = false
      }}
    />,
    <VolumeDownIcon onClick={onVolumeClick} />,
    <VolumeUpIcon onClick={onVolumeClick} />,
  ]
  const [volumeIconMode, setVolumeIconMode] = useState(2)
  const [savedValue, setSavedValue] = useState(0)

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
    if (!videoRef.current) return
    isPlaying ? videoRef.current.play() : videoRef.current.pause()
  }, [isPlaying])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const player = dashjs.MediaPlayer().create()

    player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      if (resumedTime && videoRef.current)
        videoRef.current.currentTime = resumedTime
      setBitrateList(player.getBitrateInfoListFor('video'))
    })

    player.on(dashjs.MediaPlayer.events.CAN_PLAY, () => {
      setCanPlay(true)
      if (videoRef.current)
        videoRef.current.ontimeupdate = e => setCurrentTime(e.timeStamp / 1000)
    })

    player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, () =>
      localStorage.removeItem('progress')
    )

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

    player.initialize(video, src, true)
    playerRef.current = player
  }, [])

  return (
    <div className={styles.root}>
      <video
        className={cn(styles.video, {
          [styles.hidden]: !canPlay,
        })}
        ref={videoRef}
      />

      {/* <div className={styles.settings}>
        <ul>
          {speedValueList.map(speedValue => (
            <li key={speedValue} onClick={() => setCurrentSpeed(speedValue)}>
              {speedValue}
            </li>
          ))}
        </ul>
      </div> */}
      {canPlay ? (
        <div className={styles.controls}>
          {isPlaying ? (
            <PauseIcon
              onClick={() => setIsPlaying(false)}
              className={styles.play}
            />
          ) : (
            <PlayArrowIcon
              onClick={() => setIsPlaying(true)}
              className={styles.play}
            />
          )}
          <div className={styles.volume}>
            {volumeIconList[volumeIconMode]}
            <input
              ref={volumeRef}
              type='range'
              min={0}
              max={100}
              defaultValue={100}
              onChange={e => {
                if (videoRef.current) {
                  const volume = +e.target.value
                  videoRef.current.volume = volume / 100

                  if (!volume) setVolumeIconMode(0)
                  else if (volume < 50) setVolumeIconMode(1)
                  else setVolumeIconMode(2)
                }
              }}
            />
          </div>
          <span className={styles.timer}>
            {progresToTime(currentTime)} /
            {videoRef.current && progresToTime(videoRef.current.duration)}
          </span>
          <SettingsIcon />
          <PictureInPictureAltIcon />
          <FullscreenIcon className={styles.fullscreen} />
        </div>
      ) : (
        <Spinner className={styles.spinner} />
      )}
    </div>
  )
}
