import { picocolors } from '@kmijs/shared'

export const prettyTime = (seconds: number): string => {
  const format = (time: string) => picocolors.bold(time)

  if (seconds < 10) {
    const digits = seconds >= 0.01 ? 2 : 3
    return `${format(seconds.toFixed(digits))} s`
  }

  if (seconds < 60) {
    return `${format(seconds.toFixed(1))} s`
  }

  const minutes = seconds / 60
  return `${format(minutes.toFixed(2))} m`
}
