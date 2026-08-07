export default function BackgroundGrid({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-emerald/10 blur-[140px]" />
      <div className="absolute top-40 right-0 w-[500px] h-[500px] rounded-full bg-purple/10 blur-[140px]" />
      <div className="absolute top-96 left-0 w-[400px] h-[400px] rounded-full bg-blue/10 blur-[130px]" />
    </div>
  )
}
