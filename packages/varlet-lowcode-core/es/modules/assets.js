export function createAssetsManager() {
  let _assets
  const assetsManager = {
    importAssets(assets) {
      _assets = assets
    },
    exportAssets() {
      return _assets
    },
  }
  return assetsManager
}
export default createAssetsManager()
