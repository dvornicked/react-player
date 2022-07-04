// import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Player } from './components/'
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
      img: 'https://cloud.kodik-storage.com/ccef94adc005d0ce9a8c06f74211f9b3:2022070422/useruploads/208f3090-edbb-4103-94eb-2ef6393eb2cb/thumb005.jpg',
      age: 18,
    },
    src: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  }

  return <Player {...data} />
}
