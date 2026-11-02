/** 设计稿 px → rem（根字号 16px = 1rem） */
export function rem(px: number): string {
  const value = px / 16
  const rounded = Math.round(value * 10000) / 10000
  return `${rounded}rem`
}
