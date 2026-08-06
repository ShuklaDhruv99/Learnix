import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion } from 'framer-motion'
import { GitBranch, Crown, Circle } from 'lucide-react'
import SkillNode from '../components/skilltree/SkillNode'
import Breadcrumb from '../components/common/Breadcrumb'
import { useApp } from '../contexts/AppContext'

const HORIZONTAL_SPACING = 220
const VERTICAL_SPACING = 160

function computeAutoLayout(topics) {
  const byId = Object.fromEntries(topics.map((t) => [t.id, t]))
  const depthCache = {}

  function getDepth(id, visiting = new Set()) {
    if (depthCache[id] !== undefined) return depthCache[id]
    if (visiting.has(id)) return 0 // safety: cyclic guard, shouldn't happen post-validation
    visiting.add(id)

    const topic = byId[id]
    if (!topic || topic.prerequisites.length === 0) {
      depthCache[id] = 0
      return 0
    }
    const maxPrereqDepth = Math.max(...topic.prerequisites.map((p) => getDepth(p, visiting)))
    depthCache[id] = maxPrereqDepth + 1
    return depthCache[id]
  }

  const depths = {}
  topics.forEach((t) => {
    depths[t.id] = getDepth(t.id)
  })

  // Group topic ids by depth
  const layers = {}
  topics.forEach((t) => {
    const d = depths[t.id]
    if (!layers[d]) layers[d] = []
    layers[d].push(t.id)
  })

  const positions = {}
  Object.entries(layers).forEach(([depth, ids]) => {
    const count = ids.length
    const totalWidth = (count - 1) * HORIZONTAL_SPACING
    const startX = -totalWidth / 2
    ids.forEach((id, i) => {
      positions[id] = {
        x: startX + i * HORIZONTAL_SPACING,
        y: Number(depth) * VERTICAL_SPACING,
      }
    })
  })

  return positions
}

function hasMeaningfulPositions(topics) {
  // If every topic sits at exactly (0,0), treat positions as unset
  return topics.some((t) => t.position_x !== 0 || t.position_y !== 0)
}

const nodeTypes = { skillNode: SkillNode }

const EDGE_COLOR = {
  completed: '#F5B942',
  unlocked: '#3B82F6',
  current: '#A855F7',
  locked: 'rgba(255,255,255,0.12)',
}

export default function SkillTree() {
  const [searchParams] = useSearchParams()
  const subjectId = searchParams.get('subject')
  const navigate = useNavigate()
  const { fetchTopics, subjects } = useApp()

  const [topicsData, setTopicsData] = useState([])
  const [loading, setLoading] = useState(true)

  const subject = subjects.find((s) => String(s.id) === String(subjectId))

  function loadTopics(showLoading = true) {
    if (!subjectId) return
    if (showLoading) setLoading(true)
    return fetchTopics(subjectId)
      .then((data) => {
        const useStoredPositions = hasMeaningfulPositions(data)
        const autoPositions = useStoredPositions ? null : computeAutoLayout(data)
        const mapped = data.map((t) => ({
          ...t,
          position: useStoredPositions ? { x: t.position_x, y: t.position_y } : autoPositions[t.id],
        }))
        setTopicsData(mapped)
      })
      .catch((err) => console.error('Failed to load topics', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTopics()
  }, [subjectId])

  const handleOpen = useCallback(
    (id) => navigate(`/app/topics/${id}?subject=${subjectId}`),
    [navigate, subjectId]
  )

  const initialNodes = useMemo(
    () =>
      topicsData.map((t) => ({
        id: String(t.id),
        type: 'skillNode',
        position: t.position,
        data: { ...t, onOpen: handleOpen },
        draggable: false,
      })),
    [topicsData, handleOpen]
  )

  const initialEdges = useMemo(() => {
    const edges = []
    topicsData.forEach((t) => {
      t.prerequisites.forEach((prereqId) => {
        const target = t.status
        edges.push({
          id: `${prereqId}-${t.id}`,
          source: String(prereqId),
          target: String(t.id),
          type: 'smoothstep',
          animated: t.status === 'current',
          style: {
            stroke: EDGE_COLOR[target] || EDGE_COLOR.locked,
            strokeWidth: target === 'locked' ? 1.5 : 2.5,
          },
        })
      })
    })
    return edges
  }, [topicsData])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges])

  const counts = useMemo(() => {
    const c = { completed: 0, unlocked: 0, current: 0, locked: 0 }
    topicsData.forEach((t) => (c[t.status] = (c[t.status] || 0) + 1))
    return c
  }, [topicsData])

  if (!subjectId) {
    return <div className="text-white/40 text-sm">No subject selected — go to Subjects and pick one.</div>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-white/40 text-sm">Loading skill tree...</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Skill Tree' }]} />
          <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-emerald-bright" /> {subject?.name || 'Skill Tree'}
          </h1>
          <p className="text-white/40 text-sm mt-1">{topicsData.length} topics in this path.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <Legend color="#F5B942" label={`${counts.completed} Completed`} />
          <Legend color="#3B82F6" label={`${counts.unlocked} Unlocked`} />
          <Legend color="#A855F7" label={`${counts.current} Current`} />
          <Legend color="rgba(255,255,255,0.3)" label={`${counts.locked} Locked`} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden glass"
        style={{ height: 'calc(100vh - 260px)', minHeight: 560 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesConnectable={false}
          elementsSelectable
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="rgba(255,255,255,0.12)" />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor={(n) => EDGE_COLOR[n.data.status] || EDGE_COLOR.locked}
            maskColor="rgba(9,9,11,0.7)"
          />
        </ReactFlow>

        <div className="absolute bottom-4 left-4 glass-strong rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-white/50 pointer-events-none">
          <Crown className="w-3.5 h-3.5 text-red-400" /> Boss node awaits at the end of the path
        </div>
      </motion.div>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-white/50">
      <Circle className="w-2.5 h-2.5" fill={color} stroke="none" />
      {label}
    </span>
  )
}