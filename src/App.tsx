import React, { useState, useCallback } from 'react'
import { UniversalViewer } from './components/uv';
import './App.css'

const search = new URLSearchParams(window.location.search)
const defaultManifest = search.get('manifest') || ''

function App() {
  const [manifest, setManifest] = useState(defaultManifest)

  const setManifestAndRoute = useCallback((manifest: string) => {
    setManifest(manifest)
    if(!manifest) {
      search.delete('manifest')
    } else {
      search.set('manifest', manifest)
    }
    window.location.search = search.toString()
  }, [])

  return (
    <UniversalViewer manifest={manifest} setManifest={setManifestAndRoute}></UniversalViewer>
  );
}

export default App;
