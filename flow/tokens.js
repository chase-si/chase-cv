/** 从 zutai style/style 抽出的最小样式变量，便于迁入其它项目 */
export const htmlFontSize = 14

export const rem = (size) => `${parseFloat(size) / htmlFontSize}rem`

export const COLOR = {
    buttonBlue: 'rgb(64,150,255)',
    bgWhite: '#FFFFFF',
    bgGrey: '#F2F5F8',
    mainBlue: '#1875F0',
    greyLightest: '#E8E8E8',
    activeLinerBlue: '#1875F0',
    activeLinerBlueLighter: '#6BA8F5'
}
