import React, { useState, useCallback } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import { UniversalviewerContainer } from './components/viewers/universalviewer';
import { MiradorContainer } from './components/viewers/mirador';
import { OpenSeadragonContainer } from './components/viewers/openseadragon';

type IIIFViewer = 'Universalviewer' | 'Mirador' | 'OpenSeadragon'
const availableViewers: IIIFViewer[] = ['Universalviewer', 'Mirador', 'OpenSeadragon']

// プリセットManifest URLの定義
const presetManifests = [
  {
    id: 'sample-book',
    name: 'サンプル本',
    url: 'https://iiif.io/api/cookbook/recipe/0009-book-1/manifest.json'
  },
  {
    id: 'cat-video',
    name: '猫の動画',
    url: 'https://dzkimgs.l.u-tokyo.ac.jp/videos/cat2020/manifest.json'
  },
  {
    id: 'map-cortazzi',
    name: '地図 (Cortazzi)',
    url: 'https://www.dh-jac.net/db/maps/cortazzi002/portal/iiif/3/manifest/info.json'
  },
  {
    id: 'map-bl',
    name: '地図 (BL)',
    url: 'https://www.dh-jac.net/db/maps/BLMAP-0009/BL/iiif/3/manifest/info.json'
  }
]

const search = new URLSearchParams(window.location.search)
const defaultManifest = search.get('manifest') || 'https://iiif.io/api/cookbook/recipe/0009-book-1/manifest.json'
const defaultViewer = (availableViewers.includes((search.get('viewer') as IIIFViewer)) ? search.get('viewer') : 'Universalviewer') as IIIFViewer || 'Universalviewer'
const defaultMode = (search.get('mode') as ('on' | 'off')) || 'off'

// デフォルトのManifest URLがプリセットに含まれているかチェック
const getSelectedPreset = (manifestUrl: string) => {
  const preset = presetManifests.find(p => p.url === manifestUrl)
  return preset ? preset.id : 'custom'
}

function App() {
  const [manifest, setManifest] = useState(defaultManifest)
  const [viewer, setViewer] = useState<IIIFViewer>(defaultViewer)
  const [mode, setMode] = useState<'on' | 'off'>(defaultMode)
  const [selectedPreset, setSelectedPreset] = useState<string>(getSelectedPreset(defaultManifest))

  const onViewerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextViewer = e.target.value as IIIFViewer
    setViewer(nextViewer as IIIFViewer)
    const nextSearch  = new URLSearchParams(window.location.search)
    nextSearch.set('viewer', nextViewer)
    const nextLocation = window.location.pathname + '?' + nextSearch.toString()
    window.history.replaceState({}, '', nextLocation)
  }, [])

  const onPresetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const presetId = e.target.value
    setSelectedPreset(presetId)

    if (presetId === 'custom') {
      // カスタムが選択された場合は現在のmanifest値を保持
      return
    }

    const preset = presetManifests.find(p => p.id === presetId)
    if (preset) {
      setManifest(preset.url)
      const nextSearch = new URLSearchParams(window.location.search)
      nextSearch.set('manifest', preset.url)
      const nextLocation = window.location.pathname + '?' + nextSearch.toString()
      window.history.replaceState({}, '', nextLocation)
    }
  }, [])

  const onManifestChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextManifest = e.target.value
    setManifest(nextManifest)

    // 入力されたURLがプリセットに一致するかチェック
    const matchingPreset = getSelectedPreset(nextManifest)
    setSelectedPreset(matchingPreset)

    const nextSearch = new URLSearchParams(window.location.search)
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

        <div className="mb-3">
          <label className="form-label">Manifest URLプリセット</label>
          <div>
            {presetManifests.map((preset) => (
              <div className="form-check" key={preset.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="preset"
                  id={`preset-${preset.id}`}
                  value={preset.id}
                  checked={selectedPreset === preset.id}
                  onChange={onPresetChange}
                />
                <label className="form-check-label" htmlFor={`preset-${preset.id}`}>
                  {preset.name}
                </label>
              </div>
            ))}
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="preset"
                id="preset-custom"
                value="custom"
                checked={selectedPreset === 'custom'}
                onChange={onPresetChange}
              />
              <label className="form-check-label" htmlFor="preset-custom">
                カスタムURL
              </label>
            </div>
          </div>
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
