import React, {useEffect, useState} from 'react'
import {SECURE_YT_PLAYER_URL} from '../../../../config'
import {createYoutubePlaybackSession} from './secure-yt/youtubePlaybackApi'

type Props = {
  /** Purchased video_sell id (main lesson / package). */
  videoId: number
  /** Optional chapter video_sell id when playing a package chapter. */
  chapterVideoId?: number
  phone?: string
}

/**
 * Mints an ICT playback token (auth’d), then embeds the isolated Vercel player.
 * YouTube id never touches the student SPA — only the short-lived token is passed.
 */
const VideoPlayerYoutube: React.FC<Props> = ({videoId, chapterVideoId}) => {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      setLoading(true)
      setError(null)
      setIframeSrc(null)
      try {
        const session = await createYoutubePlaybackSession(videoId, chapterVideoId)
        if (cancelled) return
        const url = new URL(SECURE_YT_PLAYER_URL)
        url.searchParams.set('token', session.playbackToken)
        setIframeSrc(url.toString())
        setLoading(false)
      } catch (e: any) {
        if (cancelled) return
        const msg =
          e?.response?.data?.message ||
          (e instanceof Error ? e.message : 'Failed to start secured playback')
        setError(Array.isArray(msg) ? msg.join(', ') : String(msg))
        setLoading(false)
      }
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [videoId, chapterVideoId])

  if (error) {
    return (
      <div className='w-100 text-center p-8'>
        <p className='text-danger mb-0'>{error}</p>
      </div>
    )
  }

  if (loading || !iframeSrc) {
    return (
      <div className='w-100 text-center p-8'>
        <p className='text-muted mb-0'>Loading secured player…</p>
      </div>
    )
  }

  return (
    <div
      className='w-100'
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        background: '#000',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <iframe
        title='Secured lesson player'
        src={iframeSrc}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
        allowFullScreen
        referrerPolicy='no-referrer'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
      />
    </div>
  )
}

export default VideoPlayerYoutube
