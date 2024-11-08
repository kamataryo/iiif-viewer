import React from 'react'
import { useRef, useEffect, useState } from 'react'
import * as uv from 'universalviewer'
import 'universalviewer/dist/esm/index.css'

type Props = {
  manifest: string
}

export const Universalviewer: React.FC<Props> = (props) => {
  const uvContainerRef = useRef<HTMLDivElement>(null)
  const [uvInit, setUvInit] = useState(false)

  const { manifest } = props

  useEffect(() => {
    const __alert = window.alert
    // Universalviewer のアラートを乗っ取って、特定のメッセージのみ表示する
    window.alert = (arg) => {
      if(arg === 'Unable to load manifest') {
        const message = `Unable to load manifest: ${manifest}`
        __alert(message)
      } else {
        __alert(arg)
      }
    }
    () => {
      window.alert = __alert
    }
  }, [])

  useEffect(() => {
    if(manifest && !uvInit) {
      uv.init('uv', { manifest })
      setUvInit(true)
    }
  }, [manifest, uvInit])

  return (
    <div className="uv" id="uv" ref={uvContainerRef}></div>
  )
}
