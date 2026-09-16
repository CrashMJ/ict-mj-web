import React, { useEffect, useMemo, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

type Props = {
  videoInfo?: any
  buyInfo?: any
  remainingViews?: number
  usedViews?: number
  maxViews?: number
}

const parseDate = (value: any): Date | null => {
  if (!value) return null

  const asDate = new Date(value)
  if (!isNaN(asDate.getTime())) return asDate

  const match = String(value).match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/)
  if (match) {
    const parsed = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
    if (!isNaN(parsed.getTime())) return parsed
  }

  return null
}

const isDateOnly = (value: any) => {
  if (typeof value !== 'string') return false
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) || /^\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}$/.test(value.trim())
}

export const getLessonExpiryDate = (buyInfo: any, videoInfo: any): Date | null => {
  if (!buyInfo) return null

  const record = buyInfo.videoBuy || buyInfo.video_buy || buyInfo
  const recordings = record.viewCount?.recordings || buyInfo.viewCount?.recordings
  const recording = Array.isArray(recordings)
    ? recordings.find((item: any) => Number(item.videoId) === Number(videoInfo?.id)) || recordings[0]
    : undefined
  const rawExpiry =
    record.expire_date ||
    record.end_date ||
    record.expireDate ||
    record.endDate ||
    recording?.expireDate ||
    recording?.endDate ||
    recording?.expiresAt ||
    recording?.validUntil ||
    recording?.expire_date
  const direct = parseDate(rawExpiry)
  if (direct) {
    if (isDateOnly(rawExpiry)) {
      direct.setHours(23, 59, 59, 999)
    }
    return direct
  }

  const start = parseDate(record.start_date || record.startDate || record.paid_date || buyInfo.start_date || buyInfo.paid_date)
  const days = Number(record.days ?? buyInfo.days ?? videoInfo?.days)
  if (start && Number.isFinite(days) && days > 0) {
    const end = new Date(start.getTime())
    end.setDate(end.getDate() + days)
    return end
  }

  return null
}

const getTimeLeft = (expiry: Date): TimeLeft | null => {
  const distance = expiry.getTime() - Date.now()
  if (distance <= 0) return null

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

const LessonAccessLimit: React.FC<Props> = ({ videoInfo, buyInfo, remainingViews, usedViews, maxViews }) => {
  const viewDays = Number(buyInfo?.days ?? videoInfo?.days)
  const hasPurchase = Boolean(buyInfo && buyInfo.payment_status === 'approved')
  const hasViewQuota = Number.isFinite(Number(maxViews)) && Number(maxViews) > 0
  const expiryDate = useMemo(() => (hasPurchase ? getLessonExpiryDate(buyInfo, videoInfo) : null), [buyInfo, videoInfo, hasPurchase])
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => (expiryDate ? getTimeLeft(expiryDate) : null))

  useEffect(() => {
    if (!expiryDate) {
      setTimeLeft(null)
      return
    }

    const tick = () => setTimeLeft(getTimeLeft(expiryDate))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [expiryDate])

  if (!Number.isFinite(viewDays) && !expiryDate && !hasViewQuota) return null

  const formattedExpiry = expiryDate
    ? expiryDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div className='row justify-content-center pb-5'>
      <div className='col-12 col-md-10 col-xl-8'>
        {hasPurchase && expiryDate && !timeLeft ? (
          <div className='alert alert-danger mb-0'>
            <div className='alert-text fw-bold'>Your access to this lesson has expired.</div>
          </div>
        ) : (
          <div className={`notice d-flex flex-column flex-md-row align-items-center justify-content-between rounded border border-dashed p-6 ${hasPurchase && timeLeft && timeLeft.days <= 3 ? 'bg-light-danger border-danger' : 'bg-light-warning border-warning'}`}>
            <div className='text-center text-md-start mb-5 mb-md-0'>
              <h4 className='text-gray-800 fw-bolder mb-1'>
                {hasPurchase ? 'Access remaining' : 'View limit'}
              </h4>
              <div className='text-gray-600'>
                {Number.isFinite(viewDays) && viewDays > 0 && (
                  <span>
                    {hasPurchase ? 'View period' : 'Access duration'}: <strong>{viewDays} days</strong>
                  </span>
                )}
                {formattedExpiry && (
                  <span className={Number.isFinite(viewDays) && viewDays > 0 ? 'ms-3' : ''}>
                    Expires: <strong>{formattedExpiry}</strong>
                  </span>
                )}
                {hasPurchase && hasViewQuota && (
                  <div className='fs-7 mt-1'>
                    Views: <strong>{Number(usedViews ?? 0)} / {maxViews}</strong>
                    {remainingViews != null ? ` · ${Math.max(0, Number(remainingViews))} remaining` : ''}
                  </div>
                )}
                {!hasPurchase && Number.isFinite(viewDays) && viewDays > 0 && (
                  <div className='fs-7 mt-1'>Countdown starts after purchase is approved.</div>
                )}
              </div>
            </div>

            {hasPurchase && timeLeft && (
              <div className='d-flex flex-wrap justify-content-center'>
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className='border border-gray-300 border-dashed rounded min-w-70px py-3 px-3 mx-1 mb-1 text-center bg-white'
                  >
                    <div className='fs-3 fw-bolder text-gray-800'>{item.label === 'Days' ? item.value : pad(item.value)}</div>
                    <div className='fw-bold text-gray-400 fs-8 text-uppercase'>{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { LessonAccessLimit }
