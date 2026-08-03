import { MapPin, BookMarked, Clock3 } from 'lucide-react'
import Card from '../ui/Card'
import XPBar from '../ui/XPBar'

export default function ProfileCard({ student }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-bright to-blue flex items-center justify-center font-display font-bold text-3xl text-base-950 shadow-glow-emerald mb-4">
          {student.avatar}
        </div>
        <h2 className="font-display font-bold text-xl">{student.name}</h2>
        <p className="text-white/40 text-sm">@{student.username}</p>
        <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-xs">{student.bio}</p>

        <div className="flex items-center gap-2 mt-4 text-xs text-white/40">
          <MapPin className="w-3.5 h-3.5" />
          {student.university} · {student.branch}
        </div>

        <div className="w-full mt-6">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/50">Level {student.level}</span>
            <span className="text-white/50">Level {student.level + 1}</span>
          </div>
          <XPBar current={student.xp % student.xpToNextLevel} max={student.xpToNextLevel} accent="emerald" />
        </div>

        <div className="grid grid-cols-3 gap-3 w-full mt-6">
          <div className="glass rounded-xl p-3">
            <p className="font-display font-bold text-lg text-gold-bright">{student.coins}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide">Coins</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="font-display font-bold text-lg text-emerald-bright">{student.subjectsCompleted}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide">Subjects</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="font-display font-bold text-lg text-purple-bright">{student.streakDays}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide">Streak</p>
          </div>
        </div>

        <div className="w-full mt-4 space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <BookMarked className="w-3.5 h-3.5 text-blue-bright" /> Favorite subject: <span className="text-white/80">{student.favoriteSubject}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Clock3 className="w-3.5 h-3.5 text-blue-bright" /> {student.totalStudyHours}h studied total
          </div>
        </div>
      </div>
    </Card>
  )
}
