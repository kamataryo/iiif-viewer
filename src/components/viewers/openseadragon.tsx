import React from 'react'
import { useEffect, useState } from 'react'

type Props = {
  manifest: string
}

class IIIFViewerOpenseadragonError extends Error {}

export const OpenSeadragonContainer: React.FC<Props> = (props) => {
  const [osdInit, setOsdInit] = useState(false)

  const { manifest } = props


  useEffect(() => {
    if(manifest && !osdInit) {

      Promise.all([
        fetch(manifest)
          .then((resp) => {
            return resp.json()
          })
          .then(manifestObject => {
            if(manifestObject['@context'] === 'http://iiif.io/api/presentation/2/context.json') {
              throw new IIIFViewerOpenseadragonError('IIIF Presentation 2.0 is not supported on this service.')
            } else {
              return manifestObject.items[0].items[0].items[0].body.service[0].id + '/info.json'
            }
          })
          .then(imageInfo => {
            console.log(imageInfo)
            return fetch(imageInfo)
          })
          .then(resp => resp.json()),
        import('openseadragon'),
      ])
        .then(([tileSource, OpenSeadragon]) => {
          OpenSeadragon.default({
              id: 'osd',
              preserveViewport: true,
              prefixUrl: './openseadragon/images/',
              visibilityRatio:    1,
              minZoomLevel:       1,
              defaultZoomLevel:   1,
              sequenceMode:       true,
              tileSources:   [tileSource],
          });
          setOsdInit(true)
        })
        .catch(error => {
          if(error instanceof IIIFViewerOpenseadragonError) {
            alert(error.message)
          } else {
            console.error(error)
            alert('Unable to load manifest')
          }
        })

    }
  }, [manifest, osdInit])


  return (
    <div className="osd viewer-container" id="osd"></div>
  )
}
