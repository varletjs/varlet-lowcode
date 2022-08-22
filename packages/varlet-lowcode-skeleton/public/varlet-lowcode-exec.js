;((window) => {
  function exec(expression, ctx = window) {
    with (ctx) {
      return eval(`(${expression})`)
    }
  }

  window.VarletLowcodeExec = {
    default: exec,
  }
})(window)
