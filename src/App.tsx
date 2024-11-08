import React, { useState, useCallback } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import { UniversalviewerContainer } from './components/viewers/universalviewer';
import { MiradorContainer } from './components/viewers/mirador';
import { OpenSeadragonContainer } from './components/viewers/openseadragon';

type IIIFViewer = 'Universalviewer' | 'Mirador' | 'OpenSeadragon'
const availableViewers: IIIFViewer[] = ['Universalviewer', 'Mirador', 'OpenSeadragon']

const search = new URLSearchParams(window.location.search)
const defaultManifest = search.get('manifest') || 'https://iiif.io/api/cookbook/recipe/0009-book-1/manifest.json'
const defaultViewer = (availableViewers.includes((search.get('viewer') as IIIFViewer)) ? search.get('viewer') : 'Universalviewer') as IIIFViewer || 'Universalviewer'
const defaultMode = (search.get('mode') as ('on' | 'off')) || 'off'

function App() {
  const [manifest, setManifest] = useState(defaultManifest)
  const [viewer, setViewer] = useState<IIIFViewer>(defaultViewer)
  const [mode, setMode] = useState<'on' | 'off'>(defaultMode)

  const onViewerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextViewer = e.target.value as IIIFViewer
    setViewer(nextViewer as IIIFViewer)
    const nextSearch  = new URLSearchParams(window.location.search)
    nextSearch.set('viewer', nextViewer)
    const nextLocation = window.location.pathname + '?' + nextSearch.toString()
    window.history.replaceState({}, '', nextLocation)
  }, [])

  const onManifestChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextManifest = e.target.value
    setManifest(nextManifest)
    const nextSearch  = new URLSearchParams(window.location.search)
    nextSearch.set('manifest', nextManifest)
    const nextLocation = window.location.pathname + '?' + nextSearch.toString()
    window.history.replaceState({}, '', nextLocation)
  }, [])

  const onGoClick = useCallback(() => {
    setMode('on')
    const nextSearch = new URLSearchParams(window.location.search)
    nextSearch.set('manifest', manifest)
    nextSearch.set('viewer', viewer)

    // canonicalize the URL
    const prevLocation = window.location.pathname + '?' + nextSearch.toString()
    window.history.replaceState({}, '', prevLocation)

    nextSearch.set('mode', 'on')
    window.location.search = nextSearch.toString()
  }, [manifest, viewer])

  if(mode === 'on') {
    switch (viewer) {
      case 'Universalviewer':
        return <UniversalviewerContainer manifest={manifest} />
      case 'Mirador':
        return <MiradorContainer manifest={manifest} />
      case 'OpenSeadragon':
        return <OpenSeadragonContainer manifest={manifest} />
      default:
        return <div>Not implemented</div>
    }

  } else {
    return (
      <div className="container" id="manifest-input" style={ {paddingTop: 200} }>
        <h3>IIIF Viewer</h3>
        <div className="input-group mb-3">
        {
            availableViewers.map((viewerName) => {
              return <div className="form-check form-check-inline" key={viewerName}>
                <input
                className="form-check-input"
                type="radio"
                name="viewer"
                id={`viewer-${viewerName}`}
                value={viewerName}
                checked={viewer === viewerName}
                onChange={onViewerChange}
                />
                <label className="form-check-label" htmlFor={`viewer-${viewerName}`}>{viewerName}</label>
              </div>
            })
          }
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="manifest-label">IIIF Manifest URL</span>
          <input
            type="text"
            className="form-control"
            aria-describedby="manifest-label"
            placeholder={'https://example.com/manifest.json'}
            value={manifest}
            onChange={onManifestChange}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={onGoClick}
            disabled={!manifest.trim()}
          >GO</button>
        </div>
      </div>
    );
  }
}

export default App;
