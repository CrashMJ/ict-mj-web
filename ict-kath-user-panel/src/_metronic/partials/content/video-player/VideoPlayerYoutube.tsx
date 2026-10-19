import React, {useEffect, useState} from 'react'
import {SECURE_YT_PLAYER_URL} from '../../../../config'
import {createYoutubePlaybackSession} from './youtubePlaybackApi'

type Props = {
  /** Purchased video_sell id (main lesson / package). */
  videoId: number
  /** Optional chapter video_sell id when playing a package chapter. */
  chapterVideoId?: number
}

/**
 * Final student integration:
 * 1) Mint ICT playback token (Bearer auth)
 * 2) Iframe isolated Vercel player with ?token=
 * YouTube id never enters the student SPA.
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
        if (!SECURE_YT_PLAYER_URL) {
          throw new Error('SECURE_YT_PLAYER_URL is not configured')
        }
        const session = await createYoutubePlaybackSession(videoId, chapterVideoId)
        if (cancelled) return
        if (!session?.playbackToken) {
          throw new Error('Playback token missing from session response')
        }
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
