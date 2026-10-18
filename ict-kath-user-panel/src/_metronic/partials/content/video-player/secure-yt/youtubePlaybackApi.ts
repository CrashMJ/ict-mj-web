import axios, {AxiosResponse} from 'axios'
import {API_BASE_URL} from '../../../../../config'

export const YOUTUBE_CLIENT_SENTINEL = '_yt'

export type YoutubeEmbedPayload = {
  youtubeVideoId: string
  watermark: {name: string; phone: string}
  expiresAt: number
}

export type YoutubeSessionPayload = {
  playbackToken: string
  expiresAt: number
  ttlSeconds: number
}

export function isYoutubeClientSource(url: unknown): boolean {
  if (url == null) return false
  const value = String(url).trim()
  return value === YOUTUBE_CLIENT_SENTINEL || value.endsWith('_yt')
}

type ApiEnvelope<T> = {
  statusCode?: number
  message?: string
  data?: T
}

function unwrap<T>(body: ApiEnvelope<T> | T): T {
  if (body && typeof body === 'object' && 'data' in (body as ApiEnvelope<T>)) {
    return (body as ApiEnvelope<T>).data as T
  }
  return body as T
}

/** POST short-lived playback token (no YouTube id). */
export async function createYoutubePlaybackSession(
  videoId: number,
  chapterVideoId?: number
): Promise<YoutubeSessionPayload> {
  const res: AxiosResponse<ApiEnvelope<YoutubeSessionPayload>> = await axios.post(
    `${API_BASE_URL}api/video-buy/youtube/session`,
    {
      videoId,
      ...(chapterVideoId ? {chapterVideoId} : {}),
    }
  )
  return unwrap(res.data)
}

/** One-time resolve → youtubeVideoId + watermark. */
export async function resolveYoutubeEmbed(
  playbackToken: string
): Promise<YoutubeEmbedPayload> {
  const res: AxiosResponse<ApiEnvelope<YoutubeEmbedPayload>> = await axios.get(
    `${API_BASE_URL}api/video-buy/youtube/embed`,
    {params: {token: playbackToken}}
  )
  return unwrap(res.data)
}
