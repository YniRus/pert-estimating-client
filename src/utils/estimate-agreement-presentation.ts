const red = '#e53935'
const yellow = '#fbc02d'
const green = '#43a047'
export const emptyAgreementColor = '#9e9e9e'

export const agreementGradient = `conic-gradient(from 270deg at 50% 100% in oklab, ${red} 0deg, ${yellow} 126deg, ${green} 180deg)`

export function getAgreementColor(percentage: number | null): string {
    if (percentage === null) return emptyAgreementColor

    const value = Math.max(0, Math.min(100, percentage))
    const [from, to, fraction] = value <= 70
        ? [red, yellow, value / 70] as const
        : [yellow, green, (value - 70) / 30] as const

    return `color-mix(in oklab, ${from} ${(1 - fraction) * 100}%, ${to})`
}
