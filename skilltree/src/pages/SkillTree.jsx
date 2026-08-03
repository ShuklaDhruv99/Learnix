import { useCallback, useMemo, useState } from 'react'
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
import TopicDrawer from '../components/skilltree/TopicDrawer'
import Breadcrumb from '../components/common/Breadcrumb'
import topicsData from '../data/topics.json'

const nodeTypes = { skillNode: SkillNode }

const EDGE_COLOR = {
  completed: '#F5B942',
  unlocked: '#3B82F6',
  current: '#A855F7',
  locked: 'rgba(255,255,255,0.12)',
}

export default function SkillTree() {
  const [openTopicId, setOpenTopicId] = useState(null)

  const handleOpen = useCallback((id) => setOpenTopicId(id), [])

  const initialNodes = useMemo(
    () =>
      topicsData.map((t) => ({
        id: t.id,
        type: 'skillNode',
        position: t.position,
        data: { ...t, onOpen: handleOpen },
        draggable: false,
      })),
    [handleOpen]
  )

  const initialEdges = useMemo(() => {
    const edges = []
    topicsData.forEach((t) => {
      t.prerequisites.forEach((prereqId) => {
        const target = t.status
        edges.push({
          id: `${prereqId}-${t.id}`,
          source: prereqId,
          target: t.id,
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
  }, [])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const counts = useMemo(() => {
    const c = { completed: 0, unlocked: 0, current: 0, locked: 0 }
    topicsData.forEach((t) => (c[t.status] = (c[t.status] || 0) + 1))
    return c
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Skill Tree' }]} />
          <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-emerald-bright" /> Web Development Path
          </h1>
          <p className="text-white/40 text-sm mt-1">HTML to Next.js — {topicsData.length} topics, one boss level.</p>
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

      <TopicDrawer topicId={openTopicId} open={!!openTopicId} onClose={() => setOpenTopicId(null)} />
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
