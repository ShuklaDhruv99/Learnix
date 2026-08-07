import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Zap, BarChart3, CheckCircle2, Link2, PlayCircle, RefreshCw, ArrowLeft, Timer, ListChecks, Code2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import TopicSummary from '../components/skilltree/TopicSummary'
import TutorChat from '../components/skilltree/TutorChat'
import { getIcon } from '../utils/iconMap'
import { difficultyColor } from '../utils/xp'
import { useApp } from '../contexts/AppContext'
import { stagger, fadeUp } from '../animations/variants'

const TIME_OPTIONS = [15, 30, 60]

export default function TopicPage() {
  const { topicId } = useParams()
  const [searchParams] = useSearchParams()
  const subjectId = searchParams.get('subject')
  const navigate = useNavigate()

  const { fetchTopics, completeTopic, getTopicResources, fetchTopicResources, refreshResources, logStudySession } = useApp()

  const [topicsData, setTopicsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const [resources, setResources] = useState([])
  const [resourcesStatus, setResourcesStatus] = useState('idle') // idle | loading | loaded
  const [fetchingVideos, setFetchingVideos] = useState(false)
  const [fetchMessage, setFetchMessage] = useState(null)

  const [loggingTime, setLoggingTime] = useState(false)
  const [logMessage, setLogMessage] = useState(null)

  function loadTopics() {
    if (!subjectId) return
    return fetchTopics(subjectId)
      .then(setTopicsData)
      .catch((err) => console.error('Failed to load topics', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTopics()
  }, [subjectId])

  const numericTopicId = Number(topicId)
  const topic = useMemo(() => topicsData.find((t) => t.id === numericTopicId), [topicsData, numericTopicId])
  const prereqTopics = useMemo(
    () => (topic ? topic.prerequisites.map((id) => topicsData.find((t) => t.id === id)).filter(Boolean) : []),
    [topic, topicsData]
  )

  useEffect(() => {
    setJustCompleted(false)
    setCompleting(false)
    setFetchMessage(null)
    setLogMessage(null)
    setResourcesStatus('idle')
    setResources([])
  }, [topicId])

  async function handleLoadResources() {
    setResourcesStatus('loading')
    try {
      const data = await getTopicResources(numericTopicId)
      setResources(data)
      setResourcesStatus('loaded')
    } catch (err) {
      console.error('Failed to load resources', err)
      setResourcesStatus('idle')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-white/40 text-sm">Loading topic...</div>
  }

  if (!topic) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-white/40 text-sm">Topic not found.</p>
        <Link to="/app/subjects"><Button variant="secondary">Back to Subjects</Button></Link>
      </div>
    )
  }

  const Icon = getIcon(topic.icon || 'BookOpen')
  const isCompleted = topic.status === 'completed' || justCompleted

  async function handleMarkLearned() {
    setCompleting(true)
    try {
      await completeTopic(topic.id)
      setJustCompleted(true)
    } catch (err) {
      console.error('Failed to complete topic', err)
    } finally {
      setCompleting(false)
    }
  }

  async function handleLogTime(minutes) {
    setLoggingTime(true)
    setLogMessage(null)
    try {
      await logStudySession(topic.id, minutes)
      await loadTopics()
      setLogMessage(`Logged ${minutes} minutes!`)
    } catch (err) {
      setLogMessage('Failed to log study time — try again.')
    } finally {
      setLoggingTime(false)
    }
  }

  async function handleFetchVideos() {
    setFetchingVideos(true)
    setFetchMessage(null)
    try {
      const result = await fetchTopicResources(topic.id)
      const updated = await getTopicResources(topic.id)
      setResources(updated)
      await refreshResources()
      setFetchMessage(
        result.resources_created?.length > 0
          ? `Found ${result.resources_created.length} new video(s)!`
          : result.message || 'No new videos found — try again later.'
      )
    } catch (err) {
      setFetchMessage('Failed to fetch videos — try again.')
    } finally {
      setFetchingVideos(false)
    }
  }

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      <motion.button
        variants={fadeUp}
        onClick={() => navigate(-1)}
        className="text-sm text-white/50 hover:text-white inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Skill Tree
      </motion.button>

      <motion.div variants={fadeUp}>
        <Card className="p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7 text-emerald-bright" />
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-2xl sm:text-3xl leading-tight">{topic.name}</h1>
              <span className={`inline-block mt-2 text-xs font-mono px-2.5 py-1 rounded-full border ${difficultyColor(topic.difficulty)}`}>
                {topic.difficulty}
              </span>
            </div>
          </div>

          <p className="text-sm text-white/60 leading-relaxed mb-6">{topic.description}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1.5 text-blue-bright" />
              <p className="text-lg font-semibold font-mono">{topic.estimated_hours}h</p>
              <p className="text-[10px] text-white/40 uppercase">Estimate</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 mx-auto mb-1.5 text-gold-bright" />
              <p className="text-lg font-semibold font-mono">{topic.xp}</p>
              <p className="text-[10px] text-white/40 uppercase">XP Reward</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-1.5 text-purple-bright" />
              <p className="text-lg font-semibold font-mono">{isCompleted ? 100 : topic.completion}%</p>
              <p className="text-[10px] text-white/40 uppercase">Progress</p>
            </div>
          </div>

          {prereqTopics.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" /> Prerequisites
              </h4>
              <div className="flex flex-wrap gap-2">
                {prereqTopics.map((p) => (
                  <Badge key={p.id} accent={p.status === 'completed' ? 'gold' : 'emerald'}>
                    {p.status === 'completed' && <CheckCircle2 className="w-3 h-3" />} {p.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!isCompleted && topic.status !== 'locked' && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" /> Log Study Time
              </h4>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleLogTime(m)}
                    disabled={loggingTime}
                    className="px-3.5 py-2 rounded-lg glass border border-white/[0.06] text-sm hover:border-emerald/40 hover:text-emerald-bright transition-colors disabled:opacity-50"
                  >
                    +{m} min
                  </button>
                ))}
              </div>
              {logMessage && <p className="text-xs text-emerald-bright mt-2">{logMessage}</p>}
            </div>
          )}

          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            icon={CheckCircle2}
            onClick={handleMarkLearned}
            disabled={isCompleted || completing || topic.status === 'locked'}
          >
            {completing ? 'Saving...' : isCompleted ? 'Learned' : 'Mark Learned'}
          </Button>

          {topic.status === 'locked' && (
            <p className="text-xs text-white/40 mt-2">Complete the prerequisites above to unlock this topic.</p>
          )}
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <TopicSummary topicId={numericTopicId} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <PlayCircle className="w-4.5 h-4.5 text-emerald-bright" /> Video Resources
            </h3>
            {resourcesStatus === 'idle' && (
              <Button size="sm" onClick={handleLoadResources} icon={PlayCircle}>Find Videos</Button>
            )}
          </div>

          {resourcesStatus === 'idle' && (
            <p className="text-sm text-white/40">Fetch curated YouTube videos for this topic.</p>
          )}

          {resourcesStatus === 'loading' && (
            <p className="text-xs text-white/30">Loading resources...</p>
          )}

          {resourcesStatus === 'loaded' && (
            <>
              <div className="flex items-center justify-end mb-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleFetchVideos}
                  disabled={fetchingVideos}
                  icon={RefreshCw}
                  className={fetchingVideos ? '[&_svg]:animate-spin' : ''}
                >
                  {fetchingVideos ? 'Finding...' : resources.length > 0 ? 'Find more' : 'Find videos'}
                </Button>
              </div>

              {fetchMessage && <p className="text-xs text-emerald-bright mb-3">{fetchMessage}</p>}

              {resources.length === 0 ? (
                <p className="text-xs text-white/30">No videos yet — click "Find videos" to fetch some from YouTube.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {resources.map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-xl glass hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <PlayCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug group-hover:text-emerald-bright transition-colors">{r.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">{r.creator}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple/10 border border-purple/30 flex items-center justify-center shrink-0">
              <ListChecks className="w-5 h-5 text-purple-bright" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Practice Quiz</h3>
              <p className="text-xs text-white/40">Timed, with a full review at the end</p>
            </div>
          </div>
          <Link to={`/app/topics/${numericTopicId}/quiz`}>
            <Button>Start Quiz</Button>
          </Link>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue/10 border border-blue/30 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5 text-blue-bright" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Applied Practice</h3>
              <p className="text-xs text-white/40">Solve real problems — code or written — with AI feedback</p>
            </div>
          </div>
          <Link to={`/app/topics/${numericTopicId}/code-practice`}>
            <Button>Practice</Button>
          </Link>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <TutorChat topicId={numericTopicId} />
      </motion.div>
    </motion.div>
  )
}