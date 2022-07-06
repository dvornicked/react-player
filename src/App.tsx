// import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Player } from './components/'
import { Video } from './components/Player/Video/Video'
// const src = ''

// type BitrateInfoType = {
//   bitrate: number
//   height: number
//   mediaType: string
//   qualityIndex: number
//   scanType: string
//   width: number
// }

// export const App = () => {

//

//   return (
//     <>

//       {isInitialized && <select onChange={onChangeBitrate}>
//         <option value='-1'>
//           {'Auto' + (currentQuality === -1 ? autoQuality : '')}
//         </option>
//         {bitrateList.map((bitrateList: BitrateInfoType, idx: number) => (
//           <option key={bitrateList.bitrate} value={idx}>
//             {bitrateList.height}
//           </option>
//         ))}
//       </select>}
//     </>
//   )
// }

export const App = () => {
  const data = {
    preview: {
      img: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Big.Buck.Bunny.-.Frank.Bunny.png',
      age_restriction: 18,
    },
    // src: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
    src: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'
  }

  return <Player {...data} />
}
