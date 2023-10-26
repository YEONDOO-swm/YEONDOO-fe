// import React, { useEffect } from 'react';
// import mermaid from "mermaid";

// export interface MermaidProps {
//   text: string;
// }

// export const Mermaid: React.FC<MermaidProps> = ({ text }) => {
//   const ref = React.useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     mermaid.initialize({
//       startOnLoad: true,
//     //   securityLevel: "loose",
//       theme: "forest",
//     //   logLevel: 5
//     });

//     if (ref.current && text !== "") {
//         mermaid.render('preview', text).then(({ svg, bindFunctions }) => {
//             if (ref.current) {
//                 ref.current.innerHTML = svg
//                 console.log(svg)
//                 const svgElement = ref.current.querySelector('svg');
//                 if (svgElement) {
//                     svgElement.style.width = '50%'; // 예시: 너비 100%
//                     svgElement.style.height = 'auto'; // 예시: 높이 자동 조정
//                     svgElement.style.display = 'block';
//                 }

//                 bindFunctions?.(ref.current);
//             }
//         });
//     }
//   });

// //   useEffect(() => {
// //     if (ref.current && text !== "") {
// //         mermaid.render('preview', text).then(({ svg, bindFunctions }) => {
// //             if (ref.current) {
// //                 ref.current.innerHTML = svg
// //                 console.log(ref.current.innerHTML)
// //                 bindFunctions?.(ref.current);
// //             }
// //         });
// //     }
// //   }, [text]);

//   return <div>
//         <div key="preview" ref={ref} >
//         </div>
//         <svg width="100" height="100">
//         <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
//       </svg>
//     </div>
// };


import React from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "forest",
  securityLevel: "loose",
});

interface MermaidProps {
  chart: string;
}

export default class Mermaid extends React.Component<MermaidProps> {
  componentDidMount() {
    mermaid.contentLoaded();
  }

  render() {
    return <div className="mermaid">{this.props.chart}</div>;
  }
}
