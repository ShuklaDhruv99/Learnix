import * as icons from 'lucide-react'

export function getIcon(name, fallback = 'Circle') {
  return icons[name] || icons[fallback] || icons.Circle
}
