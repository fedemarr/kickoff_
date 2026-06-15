const fs = require('fs')
const path = require('path')

const serverAppDir = path.join(process.cwd(), '.next', 'server', 'app')
const rootManifest = path.join(serverAppDir, 'page_client-reference-manifest.js')
const storeManifest = path.join(serverAppDir, '(store)', 'page_client-reference-manifest.js')

if (fs.existsSync(rootManifest) && !fs.existsSync(storeManifest)) {
  fs.copyFileSync(rootManifest, storeManifest)
  console.log('✓ Copied page_client-reference-manifest.js to (store)/')
}
