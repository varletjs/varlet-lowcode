import { resolve } from 'path'
import { LibraryFormats } from 'vite'

export const CWD = process.cwd()
export const VARLET_LOW_CODE_CONFIG = resolve(CWD, 'varlet.lowcode.config.js')
export const PLUGIN_WORKSPACE = resolve(CWD, 'src')
export const PLUGIN_TS_ENTRY = resolve(CWD, 'src/index.ts')
export const PLUGIN_JS_ENTRY = resolve(CWD, 'src/index.js')
export const PLUGIN_OUTPUT_PATH = resolve(CWD, 'lib')
export const PLUGIN_OUTPUT_FORMATS: LibraryFormats[] = ['es', 'iife']
export const VITE_RESOLVE_EXTENSIONS = ['.vue', '.tsx', '.ts', '.jsx', '.js', '.less', '.css']
export const PLAYGROUND = resolve(__dirname, '../../playground')
export const PLAYGROUND_OUTPUT_PATH = resolve(CWD, 'dist')
export const PLAYGROUND_PUBLIC_PATH = resolve(CWD, 'public')
export const PLAYGROUND_DIR = resolve(CWD, '.varlet-lowcode/playground')
export const USER_PLAYGROUND_DIR = resolve(CWD, 'playground')
