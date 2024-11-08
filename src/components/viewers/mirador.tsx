import React from 'react'
import { useRef, useEffect, useState } from 'react'
// @ts-ignore
import Md from 'mirador'

type Props = {
  manifest: string
}
export const Mirador: React.FC<Props> = (props) => {
  const [mdInit, setMdInit] = useState(false)

  const { manifest } = props

  useEffect(() => {
    if(manifest && !mdInit) {
      const mdInstance = Md.viewer({
        id: 'md',
        windows: [{
          imageToolsEnabled: true,
          imageToolsOpen: true,
          manifestId: manifest,
        }],
      })
      setMdInit(true)
    }
  }, [manifest, mdInit])

  return (
    <div className="md" id="md"></div>
  )
}
