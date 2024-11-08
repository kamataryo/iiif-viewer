import React, { useRef } from 'react'
import { useEffect, useState } from 'react'

type Props = {
  manifest: string
}
export const OpenSeadragonContainer: React.FC<Props> = (props) => {
  const [osdInit, setOsdInit] = useState(false)
  const osdContainerRef = useRef<HTMLDivElement>(null)


  const { manifest } = props


  useEffect(() => {
    if(manifest && !osdInit) {

      Promise.all([
        fetch(manifest)
          .then((resp) => resp.json())
          .then(manifestObject => manifestObject.items[0].items[0].items[0].body.service.id + '/info.json')
          .then(imageInfo => fetch(imageInfo))
          .then(resp => resp.json()),
        import('openseadragon'),
      ])
        .then(([tileSource, OpenSeadragon]) => {
          if(!osdContainerRef.current) throw new Error('osdContainerRef is not ready')
          OpenSeadragon.default({
              id: osdContainerRef.current.id,
              preserveViewport: true,
              prefixUrl: '/public/openseadragon/images/',
              visibilityRatio:    1,
              minZoomLevel:       1,
              defaultZoomLevel:   1,
              sequenceMode:       true,
              tileSources:   [tileSource],
          });
          setOsdInit(true)
        })
    }
  }, [manifest, osdInit])

  return (
    <div className="osd viewer-container" id="osd" ref={osdContainerRef}></div>
  )
}
