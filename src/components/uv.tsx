import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as uv from 'universalviewer'
import 'universalviewer/dist/esm/index.css'
import 'bootstrap/dist/css/bootstrap.css';

type Props = {
  manifest: string
  setManifest: (manifest: string) => void
}

export const UniversalViewer: React.FC<Props> = (props) => {

  const { manifest, setManifest } = props
  const uvContainerRef = useRef<HTMLDivElement>(null)

  const [selectedManifest, setSelectedManifest] = useState<string>('')
  const [uvInit, setUvInit] = useState(false)

  useEffect(() => {
    const __alert = window.alert
    window.alert = (arg) => {
      if(arg === 'Unable to load manifest') {
        __alert(arg)
        setManifest('')
      }
    }
  }, [setManifest])

  useEffect(() => {
    if(manifest && !uvInit) {
      uv.init('uv', { manifest })
      setUvInit(true)
    }
  }, [manifest, uvInit])

  const onManifestChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedManifest(e.target.value)
  }, [])
  const onManifestKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter' && !!e.currentTarget.value) {
      setManifest(e.currentTarget.value)
    }
  }, [setManifest])

  if(!manifest) {
    return <div className="container" id="manifest-input" style={ {paddingTop: 200} }>
      <h3>IIIF Viewer <small style={{ fontSize: '0.6em' }}> with <a href="https://github.com/UniversalViewer/universalviewer">Universal Viewer</a></small></h3>
      <div className="input-group mb-3">
        <span className="input-group-text" id="manifest-label">IIIF Manifest URL</span>
        <input
        type="text"
        className="form-control"
        aria-describedby="manifest-label"
        placeholder={'https://example.com/manifest.json'}
        value={selectedManifest}
        onChange={onManifestChange}
        onKeyDown={onManifestKeyDown}
        />
      </div>
    </div>
  } else {
    return <div className="uv" id="uv" ref={uvContainerRef}></div>
  }
}
