import React from 'react'
import { useEffect, useState } from 'react'

type Props = {
  manifest: string
}
export const MiradorContainer: React.FC<Props> = (props) => {
  const [mdInit, setMdInit] = useState(false)

  const { manifest } = props

  useEffect(() => {
    if(manifest && !mdInit) {
      // @ts-ignore
      import('mirador')
        .then((Mirador) => {
          Mirador.default.viewer({
            id: 'md',
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
    <div className="md viewer-container" id="md"></div>
  )
}
