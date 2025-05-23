// 清除文字选区
export const removeAllRanges = () => {
  const selection = window.getSelection()
  if (selection) {
    selection.removeAllRanges()
  }
}
