import { Play, FileText, Newspaper, ListChecks, Star, Eye, Bookmark } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { accentMap, difficultyColor } from '../../utils/xp'

const TYPE_ICON = { youtube: Play, pdf: FileText, article: Newspaper, mcq: ListChecks }

export default function ResourceCard({ resource, bookmarked = false, onToggleBookmark }) {
  const TypeIcon = TYPE_ICON[resource.type] || FileText
  const a = accentMap[resource.thumbnail_color] || accentMap.emerald
  const hasRating = resource.rating && Number(resource.rating) > 0
  const hasViews = resource.views && resource.views.trim() !== ''

  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
      <Card hover glow={resource.thumbnail_color} className="overflow-hidden group cursor-pointer">
        <div className="relative h-28 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
          <div className={`w-12 h-12 rounded-full ${a.bgSoft} border ${a.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <TypeIcon className={`w-5 h-5 ${a.text}`} />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleBookmark?.(resource.id)
            }}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60"
            aria-label="Bookmark resource"
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-gold-bright text-gold-bright' : 'text-white/70'}`} />
          </button>
          {resource.duration && (
            <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
              {resource.duration}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge accent={resource.thumbnail_color} className="!text-[10px]">{resource.platform}</Badge>
            {resource.difficulty && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${difficultyColor(resource.difficulty)}`}>
                {resource.difficulty}
              </span>
            )}
          </div>
          <h4 className="font-medium text-sm leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">{resource.title}</h4>
          <p className="text-xs text-white/40 mb-2.5">{resource.creator}</p>
          {(hasViews || hasRating) && (
            <div className="flex items-center gap-3 text-[11px] text-white/40 font-mono">
              {hasViews && (
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {resource.views}
                </span>
              )}
              {hasRating && (
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-gold-bright text-gold-bright" /> {resource.rating}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </a>
  )
}