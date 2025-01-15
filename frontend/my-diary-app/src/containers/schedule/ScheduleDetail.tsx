import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Save, X } from 'lucide-react'
import { API_URL, API_ENDPOINTS } from './constants'

export default function ScheduleDetail({ schedule, onUpdate, onExpandedChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [detailData, setDetailData] = useState(null)

  const handleEditClick = () => {
    setEditedTitle(detailData?.title || schedule.title)
    setEditedContent(detailData?.content || schedule.content || '')
    setIsEditing(true)
  }

  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded);
    }
  }, [isExpanded, onExpandedChange]);

  useEffect(() => {
    if (isExpanded) {
      fetchDetail()
    }
  }, [isExpanded, schedule.id])

  const fetchDetail = async () => {
    if (!isExpanded) return
    
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await fetch(`${API_URL}${API_ENDPOINTS.DETAIL}${schedule.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch schedule details')
      }

      const data = await response.json()
      setDetailData(data)
    } catch (error) {
      console.error('Failed to load details:', error)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await fetch(`${API_URL}${API_ENDPOINTS.UPDATE}?id=${schedule.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        })
      })

      const updatedSchedule = await response.json()
      
      if (!response.ok) {
        throw new Error(updatedSchedule.message || 'Failed to update schedule')
      }

      onUpdate(schedule.id, updatedSchedule)
      setIsEditing(false)
      setIsExpanded(false)
      setDetailData(updatedSchedule)
    } catch (error) {
      console.error('Failed to update schedule:', error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Failed to update schedule')
      }
    }
  }

  const contentVariants = {
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    expanded: { 
      height: 'auto', 
      opacity: 1, 
      transition: { duration: 0.2, ease: "easeInOut" } 
    }
  }

  return (
    <div className={`relative w-full px-1 ${isExpanded ? 'max-w-full' : 'max-w-2xl'} overflow-hidden`}> 
      <motion.div 
        onClick={() => !isEditing && setIsExpanded(!isExpanded)}
        className={`
          cursor-pointer w-full bg-white/80 backdrop-blur-xl rounded-2xl p-4 
          shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/40 mb-0
          ${isExpanded ? 'min-h-[200px]' : ''}
        `}
        layout
      >
        <motion.div 
          className="flex items-center justify-between mb-4"
          layout="position"
        >
          {isEditing ? (
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#ffd7ec] backdrop-blur-xl border-2 border-[#ffd7ec]/60 focus:border-[#ffd7ec]/70 focus:outline-none text-base shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
              placeholder="일정 제목을 입력하세요"
              style={{ color: '#5C5C5C' }}
            />
          ) : (
            <div className="flex items-center justify-between w-full">
              <motion.h3 
                layout="position" 
                className="text-base p-1 truncate"
                style={{
                  transform: 'none',
                  transformOrigin: '50% 50% 0px',
                  color: '#5C5C5C'
                }}
              >
                {schedule.title}
              </motion.h3>
              {isExpanded && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditClick()
                  }}
                  className="p-2 rounded-xl hover:bg-violet-50/80 transition-all duration-200"
                >
                  <Edit2 className="h-5 w-5 text-gray-400" />
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="mt-4 border-t border-gray-100 pt-4"
              onClick={(e) => e.stopPropagation()}
              layout
            >
              {isEditing ? (
                <motion.div className="space-y-6" layout>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#ffd7ec] backdrop-blur-xl border-2 border-[#ffd7ec]/60 focus:border-[#ffd7ec]/70 focus:outline-none text-base shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-all duration-300"
                    rows={4}
                    placeholder="일정 내용을 입력하세요"
                    style={{ color: '#5C5C5C' }}
                  />
                  <div className="flex justify-end gap-2 pt-4">
                    <motion.button
                      onClick={handleSave}
                      className="px-3 py-1.5 rounded-xl bg-violet-100 hover:bg-violet-200 transition-all duration-200 text-violet-700 text-sm border border-violet-200"
                    >
                      저장
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setIsEditing(false)
                        setIsExpanded(false)
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-[#5C5C5C] text-sm border border-gray-200"
                    >
                      취소
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.p 
                  className="text-base p-3"
                  style={{ 
                    transform: 'none',
                    transformOrigin: '50% 50% 0px',
                    color: '#5C5C5C'
                  }}
                  layout
                >
                  {detailData?.content || schedule.content || '내용이 없습니다.'}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}