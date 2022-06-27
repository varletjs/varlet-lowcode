import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&inline'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&inline'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker&inline'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker&inline'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker&inline'

export default function registerWorkers() {
  // @ts-ignore
  self.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'json') {
        return new JsonWorker()
      }

      if (label === 'css' || label === 'scss' || label === 'less') {
        return new CssWorker()
      }

      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new HtmlWorker()
      }

      if (label === 'typescript' || label === 'javascript') {
        return new TsWorker()
      }

      return new EditorWorker()
    },
  }
}
