import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/file'

type internalPlayerType = Record<string, any> | null

type BitrateInfoType = {
  bitrate: number
  height: number
  mediaType: string
  qualityIndex: number
  scanType: string
  width: number
}

export const App = () => {
  const playerRef = useRef<ReactPlayer>(null)
  const [internalPlayer, setInternalPlayer] = useState<internalPlayerType>(null)
  const [currentQuality, setCurrentQuality] = useState<number>(0)

  const onChangeBitrate = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentQuality(Number(event.target.value))
  }

  useEffect(() => {
    // internalPlayer?.updateSettings({
    //   streaming: {
    //     abr: {
    //       autoSwitchBitrate: {
    //         video: false,
    //       },
    //     },
    //   },
    // })
    internalPlayer?.setQualityFor('video', currentQuality, true)
  }, [currentQuality])

  return (
    <>
      <div style={{ border: '1px solid black' }}>
        <ReactPlayer
          ref={playerRef}
          controls
          onReady={() => {
            if (!playerRef.current) return
            const _internalPlayer = playerRef.current?.getInternalPlayer('dash')
            setInternalPlayer(_internalPlayer)
            setCurrentQuality(_internalPlayer?.getQualityFor('video'))
          }}
          onProgress={() => {
            console.log(
              internalPlayer,
              internalPlayer?.getQualityFor('video'),
              // internalPlayer?.getSettings().streaming,
              // internalPlayer?.getBufferLength()
            )
          }}
          config={{
            forceDASH: true,
          }}
          url='https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
        />
      </div>
      <div>
        <div>
          Quality: {currentQuality}
          <select onChange={onChangeBitrate}>
            {internalPlayer
              ?.getBitrateInfoListFor('video')
              .map((e: BitrateInfoType, idx: number) => (
                <option key={e.bitrate} value={idx}>
                  {e.height}
                </option>
              ))}
          </select>
        </div>
        <div>
          <button onClick={() => internalPlayer?.setVolume(0.5)}>
            Volume = 50
          </button>
        </div>
      </div>
    </>
  )
}
