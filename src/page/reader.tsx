import React, { useEffect, useRef } from 'react'

const Reader = () => {
  const iframeRef = useRef(null); //generic type 지정

  const handleClick = () => {
    if(iframeRef && iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ message: "어쩌구저쩌구" }, '*');
    }
  }
  
  return (
    <div>
      <button onClick={handleClick}>클릭</button>
      <iframe src="http://localhost:3000/dev/reader.html" width="100%" height="600%" ref={iframeRef}></iframe>
    </div>
  )
}

export default Reader

// import React from 'react'

// const ReaderC = () => {
//     for (var prop in window) {
// 		console.log(prop);
// 	}
//   return (
//     <div>ReaderC</div>
//   )
// }

// export default ReaderC