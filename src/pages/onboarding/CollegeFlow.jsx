import ChipSelect from '../../components/ui/ChipSelect'
import { universities, branches, semesters } from '../../data/onboardingOptions'

export default function CollegeFlow({ data, onChange }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">Tell us about college</h2>
        <p className="text-white/40 text-sm">We'll match your university's exact semester syllabus.</p>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3 block">University</label>
        <ChipSelect options={universities} value={data.university} onChange={(v) => onChange({ university: v })} />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3 block">Branch</label>
        <ChipSelect options={branches} value={data.branch} onChange={(v) => onChange({ branch: v })} />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3 block">Semester</label>
        <ChipSelect options={semesters} value={data.semester} onChange={(v) => onChange({ semester: v })} />
      </div>
    </div>
  )
}