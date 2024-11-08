import React from 'react'
import { useRef, useEffect, useState } from 'react'

type Props = {
  manifest: string
}
export const MiradorContainer: React.FC<Props> = (props) => {
  const [mdInit, setMdInit] = useState(false)
  const mdContainerRef = useRef<HTMLDivElement>(null)

  const { manifest } = props

  useEffect(() => {
    if(manifest && !mdInit) {
      // @ts-ignore
      import('mirador')
        .then((Mirador) => {
          if(!mdContainerRef.current) throw new Error('mdContainerRef is not ready')
          Mirador.default.viewer({
            id: mdContainerRef.current.id,
            windows: [{
              imageToolsEnabled: true,
              imageToolsOpen: true,
              manifestId: manifest,
            }],
          })
          setMdInit(true)
        })

    }
  }, [manifest, mdInit])

  return (
    <div className="md viewer-container" id="md" ref={mdContainerRef}></div>
  )
}
