/**
 * Get color for a tone
 * 1st tone: blue, 2nd tone: purple, 3rd tone: green, 4th tone: red, neutral: original
 */
export default function getColorForTone(tone: number): string {
  switch (tone) {
    case 1:
      return "#3b82f6"; // blue
    case 2:
      return "#a855f7"; // purple
    case 3:
      return "#10b981"; // green
    case 4:
      return "#ef4444"; // red
    default:
      return ""; // neutral - original color
  }
}
