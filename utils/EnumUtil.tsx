export function getUIDisplayText(enumValue: string) {
  const textSplit = enumValue.split('_');
  let displayText = '';
  textSplit.map(text => {
    displayText = displayText.concat(text.substring(0, 1).toUpperCase())
    .concat(text.substring(1).toLowerCase())
    .concat(' ')
  })
  return displayText;
}

export function getEnumOriginalValue(enumValue: string) {
  return enumValue.toUpperCase().replace(' ', '_');
}