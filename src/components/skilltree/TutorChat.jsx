import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Loader2, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import { useApp } from '../../contexts/AppContext'
import ReactMarkdown from 'react-markdown'
import ConfirmDialog from '../ui/ConfirmDialog'

export default function TutorChat({ topicId }) {
  const { getTopicChat, sendTopicChatMessage, clearTopicChat } = useApp()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    getTopicChat(topicId)
      .then(setMessages)
      .catch((err) => console.error('Failed to load chat history', err))
      .finally(() => setLoading(false))
  }, [topicId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text, created_at: new Date().toISOString() }])
    setSending(true)

    try {
      const { reply } = await sendTopicChatMessage(topicId, text)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, created_at: new Date().toISOString() }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I couldn't respond just now — try again.", created_at: new Date().toISOString() }])
    } finally {
      setSending(false)
    }
  }

  async function handleClear() {
    setConfirmOpen(false)
    setClearing(true)
    try {
      await clearTopicChat(topicId)
      setMessages([])
    } catch (err) {
      console.error('Failed to clear chat', err)
    } finally {
      setClearing(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-blue-bright" /> Ask the Tutor
        </h3>
        {messages.length > 0 && (
            <button
            onClick={() => setConfirmOpen(true)}
            disabled={clearing}
            className="text-xs text-white/40 hover:text-red-400 inline-flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
                <Trash2 className="w-3.5 h-3.5" />
                {clearing ? 'Clearing...' : 'Clear chat'}
            </button>
        )}
      </div>

      <div ref={scrollRef} className="max-h-96 overflow-y-auto space-y-3 mb-4 pr-1">
        {loading ? (
          <p className="text-xs text-white/30">Loading conversation...</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-white/30">Ask anything about this topic — explanations, examples, or practice help.</p>
        ) : (
          messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald/15 border border-emerald/30 text-white'
                    : 'glass text-white/80'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ol]:my-2 [&_pre]:bg-black/30 [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-emerald-bright [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                )}
              </div>
            </motion.div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-bright" />
              <span className="text-xs text-white/40">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this topic..."
          rows={1}
          className="flex-1 rounded-xl glass p-3 text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-blue/50 resize-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="px-4 rounded-xl bg-blue/15 border border-blue/30 text-blue-bright hover:bg-blue/20 transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Clear this conversation?"
        message="This will permanently delete your entire chat history for this topic. This cannot be undone."
        confirmLabel="Clear Chat"
        onConfirm={handleClear}
        onCancel={() => setConfirmOpen(false)}
        loading={clearing}
      />
    </Card>
  )
}