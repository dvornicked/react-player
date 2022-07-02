import { useRef, useState } from 'react'
import ReactPlayer from 'react-player/lazy'

export const App = () => {
  const playerRef = useRef<ReactPlayer>(null)
  const [isReady, setReady] = useState(false)

  const changeTime = (seconds: number) => {
    if (!playerRef.current) return
    const currentTime = playerRef.current.getCurrentTime()
    playerRef.current.seekTo(currentTime + seconds)
  }

  const onChangeBitrate = (event: any) => {
    const internalPlayer = playerRef.current?.getInternalPlayer('hls')
    if (internalPlayer) {
      internalPlayer.currentLevel = event.target.value
    }
  }

  return (
    <>
      <ReactPlayer
        ref={playerRef}
        controls
        onReady={() => setReady(true)}
        onProgress={progress =>
          console.log(playerRef.current?.getInternalPlayer('hls'))
        }
        config={{
          file: {
            forceHLS: true,
          },
        }}
        url='http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8'
      />
      <div>
        <button onClick={() => changeTime(10)}>+10s</button>
        Quality:
        {isReady && (
          <select onChange={onChangeBitrate}>
            {playerRef.current
              ?.getInternalPlayer('hls')
              ?.levels.map((level: any, id: any) => (
                <option key={id} value={id}>
                  {level.bitrate}
                </option>
              ))}
          </select>
        )}
      </div>
    </>
  )
}
