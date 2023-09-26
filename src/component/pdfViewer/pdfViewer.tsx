import React, { Component, useState } from 'react';

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from 'react-pdf-highlighter';

// import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";

import { testHighlights as _testHighlights } from './test-highlights';
// import { Spinner } from './Spinner';
// import { Sidebar } from './Sidebar';

// import './style.css';

const testHighlights: any = _testHighlights;

const getNextId = () => String(Math.random()).slice(2);

// const parseIdFromHash = () =>
//   document.location.hash.slice('#highlight-'.length);

// const resetHash = () => {
//   document.location.hash = '';
// };

const HighlightPopup = ({ comment }: {comment: any}) =>
  comment && comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = 'https://arxiv.org/pdf/1708.08021.pdf';
const SECONDARY_PDF_URL = 'https://arxiv.org/pdf/1604.02480.pdf';

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = PRIMARY_PDF_URL;

const PdfViewer = () => {
  const [state, setState] = useState( {
    url: initialUrl,
    highlights: testHighlights[initialUrl]
      ? [...testHighlights[initialUrl]]
      : [],
  });

  const [scrollViewerTo, setScrollViewerTo] = useState(() => {})

  // const resetHighlights = () => {
  //   setState({
  //     url: state.url,
  //     highlights: [],
  //   });
  // };

  // const toggleDocument = () => {
  //   const newUrl =
  //     state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

  //   setState({
  //     url: newUrl,
  //     highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
  //   });
  // };

  // const scrollViewerTo = (highlight:any) => {};

  // const scrollToHighlightFromHash = () => {
  //   const highlight = getHighlightById(parseIdFromHash());

  //   if (highlight) {
  //     scrollViewerTo(highlight);
  //   }
  // };

  // const componentDidMount = () => {
  //   window.addEventListener(
  //     'hashchange',
  //     scrollToHighlightFromHash,
  //     false
  //   );
  // }

  // const getHighlightById = (id: any) => {
  //   const { highlights } = state;

  //   return highlights.find((highlight) => highlight.id === id);
  // }

  // const addHighlight = (highlight: any) => {
  //   const { highlights } = state;

  //   console.log('Saving highlight', highlight);

  //   setState({
  //     url: state.url,
  //     highlights: [{ ...highlight, id: getNextId() }, ...highlights],
  //   });
  // }

  // const updateHighlight = (highlightId: any, position: any, content: any) => {
  //   console.log('Updating highlight', highlightId, position, content);

  //   setState({
  //     url: state.url,
  //     highlights: state.highlights.map((h) => {
  //       const {
  //         id,
  //         position: originalPosition,
  //         content: originalContent,
  //         ...rest
  //       } = h;
  //       return id === highlightId
  //         ? {
  //             id,
  //             position: { ...originalPosition, ...position },
  //             content: { ...originalContent, ...content },
  //             ...rest,
  //           }
  //         : h;
  //     }),
  //   });
  // }

  
    const { url, highlights } = state;

    return (
      <div className="App" style={{ display: 'flex', height: '100vh'}}>
        {/* <Sidebar
          highlights={highlights}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
        /> */}
        <div
          style={{
            height: '100vh',
            width: '75vw',
            position: 'relative',
          }}
        >
          <PdfLoader url={url}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                // onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo) => {
                  setScrollViewerTo(() => {scrollTo}); // useState 써서 바꾸어야 함

                  // scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position, // 여기서 자동으로 position을 준다. selection하면 position과 content을 백으로 넘겨준다
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  // <Tip
                  //   onOpen={transformSelection}
                  //   onConfirm={(comment) => {
                  //     addHighlight({ content, position, comment });

                  //     hideTipAndSelection();
                  //   }}
                  // />
                  null
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.image //image가 true일 경우로 수정
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      // comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      // onChange={(boundingRect) => {
                      //   updateHighlight(
                      //     highlight.id,
                      //     { boundingRect: viewportToScaled(boundingRect) },
                      //     { image: screenshot(boundingRect) }
                      //   );
                      // }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        // setTip(highlight, (highlight) => popupContent)
                        null
                      }
                      onMouseOut={
                        // hideTip
                        null
                      }
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );
  
}

export default PdfViewer;