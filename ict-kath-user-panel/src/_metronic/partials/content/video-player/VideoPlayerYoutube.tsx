import React, {useEffect, useRef, useState} from 'react'
import {
  IconForward,
  IconFullscreen,
  IconFullscreenExit,
  IconMute,
  IconPause,
  IconPlay,
  IconRewind,
  IconSpeed,
  IconVolume,
} from './secure-yt/PlayerIcons'
import {
  DEFAULT_SPEEDS,
  disableCaptions,
  formatTime,
  loadYoutubeIframeApi,
  type YtPlayer,
} from './secure-yt/youtubeApi'
import {useDevToolsGuard} from './secure-yt/useDevToolsGuard'
import {
  createYoutubePlaybackSession,
  resolveYoutubeEmbed,
} from './secure-yt/youtubePlaybackApi'
import './secure-yt/secure-yt-player.css'

type Props = {
  /** Purchased video_sell id (main lesson / package). */
  videoId: number
  /** Optional chapter video_sell id when playing a package chapter. */
  chapterVideoId?: number
  phone?: string
}

type Pos = {top: string; left: string}

const SKIP_SECONDS = 10
const CONTROLS_HIDE_MS = 7000

const VideoPlayerYoutube: React.FC<Props> = ({videoId, chapterVideoId}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const volumeBeforeMute = useRef(80);

  const [playerReady, setPlayerReady] = useState(false);
  const [watermark, setWatermark] = useState<{
    name: string;
    phone: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [speeds, setSpeeds] = useState<number[]>(DEFAULT_SPEEDS);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isFs, setIsFs] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [pos1, setPos1] = useState<Pos>({ top: "15%", left: "10%" });
  const [pos2, setPos2] = useState<Pos>({ top: "70%", left: "55%" });
  const devToolsOpen = useDevToolsGuard();
  const wasDevToolsOpen = useRef(false);
  /** YouTube id kept only in a ref — never left in React state for inspection. */
  const ytIdRef = useRef<string | null>(null);

  const scrubYtFromDom = (root: ParentNode | null | undefined) => {
    if (!root) return;
    root.querySelectorAll("iframe").forEach((iframe) => {
      try {
        iframe.removeAttribute("src");
        iframe.setAttribute("src", "about:blank");
        iframe.remove();
      } catch {
        /* ignore */
      }
    });
    // Strip any leftover youtube/youtu.be strings from attributes in our shell
    root.querySelectorAll("*").forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        const v = attr.value;
        if (/youtube|youtu\.be|googlevideo|ytimg/i.test(v)) {
          el.removeAttribute(attr.name);
        }
      }
    });
  };

  const teardownPlayer = () => {
    try {
      playerRef.current?.stopVideo();
    } catch {
      /* ignore */
    }
    try {
      playerRef.current?.destroy();
    } catch {
      /* ignore */
    }
    playerRef.current = null;
    ytIdRef.current = null;
    setPlayerReady(false);
    setPlaying(false);
    setWatermark(null);

    scrubYtFromDom(shellRef.current);
    scrubYtFromDom(hostRef.current?.parentElement);

    if (hostRef.current) {
      try {
        hostRef.current.replaceChildren();
      } catch {
        /* ignore */
      }
      if ((hostRef.current as HTMLElement).tagName === "IFRAME") {
        const iframe = hostRef.current as unknown as HTMLIFrameElement;
        iframe.removeAttribute("src");
        iframe.src = "about:blank";
      }
    }

    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => undefined);
    }
  };

  useEffect(() => {
    if (devToolsOpen) {
      wasDevToolsOpen.current = true;
      teardownPlayer();
      return;
    }
    if (wasDevToolsOpen.current) {
      wasDevToolsOpen.current = false;
      setReloadToken((n) => n + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devToolsOpen]);

  useEffect(() => {
    if (devToolsOpen) return;
    let cancelled = false;

    async function boot() {
      setLoading(true);
      setError(null);
      teardownPlayer();
      setWatermark(null);
      try {
        const session = await createYoutubePlaybackSession(videoId, chapterVideoId)
        if (cancelled) return
        const embed = await resolveYoutubeEmbed(session.playbackToken)
        if (cancelled) return
        // Store id only in ref (not React state)
        ytIdRef.current = embed.youtubeVideoId
        setWatermark(embed.watermark)
        setPlayerReady(true)
        setLoading(false)
      } catch (e: any) {
        if (!cancelled) {
          const msg =
            e?.response?.data?.message ||
            (e instanceof Error ? e.message : 'Failed to start playback')
          setError(Array.isArray(msg) ? msg.join(', ') : String(msg))
          setLoading(false)
        }
      }
    }

    boot()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, chapterVideoId, reloadToken, devToolsOpen])

  useEffect(() => {
    if (devToolsOpen || !playerReady || !ytIdRef.current || !hostRef.current) {
      return;
    }
    let cancelled = false;
    // Keep id in ref until teardown — clearing early breaks React Strict Mode remounts
    const bootId = ytIdRef.current;

    (async () => {
      await loadYoutubeIframeApi();
      if (cancelled || !hostRef.current || !window.YT || !bootId) return;

      playerRef.current?.destroy();
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId: bootId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: { target: YtPlayer }) => {
            setDuration(e.target.getDuration() || 0);
            disableCaptions(e.target);
            try {
              const available = e.target.getAvailablePlaybackRates?.() || [];
              if (available.length) setSpeeds(available);
              e.target.setPlaybackRate(1);
              setSpeed(1);
              e.target.setVolume(80);
              e.target.unMute();
              setVolume(80);
              setMuted(false);
            } catch {
              setSpeeds(DEFAULT_SPEEDS);
            }
            // Harden iframe: block popups / top navigation from inside YT chrome
            try {
              const iframe = hostRef.current?.querySelector("iframe")
                || (hostRef.current?.tagName === "IFRAME"
                  ? (hostRef.current as unknown as HTMLIFrameElement)
                  : null)
                || shellRef.current?.querySelector("iframe");
              if (iframe) {
                iframe.setAttribute(
                  "sandbox",
                  "allow-scripts allow-same-origin allow-presentation allow-forms"
                );
                iframe.setAttribute("referrerpolicy", "no-referrer");
                iframe.style.pointerEvents = "none";
              }
            } catch {
              /* ignore */
            }
          },
          onStateChange: (e: { data: number; target: YtPlayer }) => {
            const YT = window.YT;
            if (!YT) return;
            setPlaying(e.data === YT.PlayerState.PLAYING);
            if (
              e.data === YT.PlayerState.PLAYING ||
              e.data === YT.PlayerState.PAUSED
            ) {
              disableCaptions(e.target);
            }
          },
          onPlaybackRateChange: (e: { data: number }) => {
            setSpeed(e.data);
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      if (tickRef.current) window.clearInterval(tickRef.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setSpeed(1);
      setPlaying(false);
    };
  }, [playerReady, devToolsOpen]);

  useEffect(() => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        setCurrent(p.getCurrentTime() || 0);
        const d = p.getDuration() || 0;
        if (d && d !== duration) setDuration(d);
        setMuted(Boolean(p.isMuted?.()));
        const v = p.getVolume?.();
        if (typeof v === "number") setVolume(v);
      } catch {
        /* player tearing down */
      }
    }, 400);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [duration, playerReady]);

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPos1({
        top: `${Math.random() * 70 + 10}%`,
        left: `${Math.random() * 70 + 10}%`,
      });
      setPos2({
        top: `${Math.random() * 70 + 10}%`,
        left: `${Math.random() * 70 + 10}%`,
      });
    }, 45_000);
    return () => window.clearInterval(interval);
  }, []);

  const bumpControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      // Keep bar visible while paused so user can press play
      if (playerRef.current && window.YT) {
        try {
          if (playerRef.current.getPlayerState() !== window.YT.PlayerState.PLAYING) {
            setControlsVisible(true);
            return;
          }
        } catch {
          /* ignore */
        }
      }
      setControlsVisible(false);
    }, CONTROLS_HIDE_MS);
  };

  useEffect(() => {
    if (!playing) {
      setControlsVisible(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      return;
    }
    bumpControls();
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p || !window.YT) return;
    bumpControls();
    if (p.getPlayerState() === window.YT.PlayerState.PLAYING) p.pauseVideo();
    else p.playVideo();
  };

  const skip = (delta: number) => {
    const p = playerRef.current;
    if (!p) return;
    const next = Math.max(0, Math.min((p.getCurrentTime() || 0) + delta, p.getDuration() || 0));
    p.seekTo(next, true);
    setCurrent(next);
  };

  const onSeek = (value: number) => {
    playerRef.current?.seekTo(value, true);
    setCurrent(value);
  };

  const onSpeedChange = (rate: number) => {
    setSpeed(rate);
    try {
      playerRef.current?.setPlaybackRate(rate);
    } catch {
      /* ignore */
    }
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (p.isMuted()) {
        p.unMute();
        p.setVolume(volumeBeforeMute.current || 80);
        setMuted(false);
        setVolume(volumeBeforeMute.current || 80);
      } else {
        volumeBeforeMute.current = p.getVolume() || volume || 80;
        p.mute();
        setMuted(true);
      }
    } catch {
      /* ignore */
    }
  };

  const onVolumeChange = (value: number) => {
    const p = playerRef.current;
    setVolume(value);
    if (!p) return;
    try {
      p.setVolume(value);
      if (value <= 0) {
        p.mute();
        setMuted(true);
      } else {
        p.unMute();
        setMuted(false);
        volumeBeforeMute.current = value;
      }
    } catch {
      /* ignore */
    }
  };

  const toggleFs = () => {
    const el = shellRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const showPlayer = !loading && playerReady && !!watermark && !devToolsOpen

  if (error) {
    return (
      <div className="secure-yt-player w-100">
        <div className="player-shell player-locked">
          <div className="devtools-blackout">
            <p className="devtools-title">Playback unavailable</p>
            <p className="devtools-copy">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading && !devToolsOpen) {
    return (
      <div className="secure-yt-player w-100">
        <div className="player-shell player-locked">
          <div className="devtools-blackout">
            <p className="devtools-copy">Loading…</p>
          </div>
        </div>
      </div>
    )
  }

  if (devToolsOpen) {
    return (
      <div className="secure-yt-player w-100">
        <div className="player-shell player-locked" aria-live="polite">
          <div className="devtools-blackout">
            <p className="devtools-title">Playback locked</p>
            <p className="devtools-copy">
              Developer tools detected. Close DevTools to continue watching.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!showPlayer) return null

  return (
    <div className="secure-yt-player w-100">
        <div
          ref={shellRef}
          className={`player-shell ${controlsVisible ? "controls-visible" : "controls-hidden"}`}
          onContextMenu={(e) => e.preventDefault()}
          onAuxClick={(e) => e.preventDefault()}
          onMouseMove={bumpControls}
          onTouchStart={bumpControls}
        >
          <div className="yt-host">
            <div ref={hostRef} />
          </div>

          {/* Full trap: no clicks reach the YouTube iframe. */}
          <button
            type="button"
            className="yt-click-trap"
            aria-label={playing ? "Pause video" : "Play video"}
            onClick={togglePlay}
            onAuxClick={(e) => e.preventDefault()}
          />

          <div
            className="watermark"
            style={{ top: pos1.top, left: pos1.left }}
          >
            {watermark.name}
          </div>
          <div
            className="watermark"
            style={{ top: pos2.top, left: pos2.left }}
          >
            {watermark.phone}
          </div>

          <div
            className="custom-controls"
            onMouseEnter={bumpControls}
            onFocusCapture={bumpControls}
          >
            <button
              type="button"
              className="ctrl-btn ctrl-btn-icon ctrl-rewind"
              onClick={() => {
                bumpControls();
                skip(-SKIP_SECONDS);
              }}
              aria-label="Rewind 10 seconds"
              title="−10s"
            >
              <IconRewind />
            </button>
            <button
              type="button"
              className="ctrl-btn ctrl-btn-icon ctrl-btn-primary ctrl-play"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              title={playing ? "Pause" : "Play"}
            >
              {playing ? <IconPause /> : <IconPlay />}
            </button>
            <button
              type="button"
              className="ctrl-btn ctrl-btn-icon ctrl-forward"
              onClick={() => {
                bumpControls();
                skip(SKIP_SECONDS);
              }}
              aria-label="Forward 10 seconds"
              title="+10s"
            >
              <IconForward />
            </button>

            <span
              className="ctrl-time"
              title={`${formatTime(current)} / ${formatTime(duration)}`}
            >
              <span className="ctrl-time-current">{formatTime(current)}</span>
              <span className="ctrl-time-sep"> / </span>
              <span className="ctrl-time-total">{formatTime(duration)}</span>
            </span>

            <input
              className="ctrl-range ctrl-seek"
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              step={0.1}
              value={Math.min(current, duration || 0)}
              onChange={(e) => {
                bumpControls();
                onSeek(Number(e.target.value));
              }}
              aria-label="Seek"
            />

            <div className="ctrl-volume">
              <button
                type="button"
                className="ctrl-btn ctrl-btn-icon ctrl-mute"
                onClick={() => {
                  bumpControls();
                  toggleMute();
                }}
                aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
                title={muted || volume === 0 ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? <IconMute /> : <IconVolume />}
              </button>
              <input
                className="ctrl-range ctrl-volume-range"
                type="range"
                min={0}
                max={100}
                step={1}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  bumpControls();
                  onVolumeChange(Number(e.target.value));
                }}
                aria-label="Volume"
              />
            </div>

            <label className="ctrl-speed" title="Playback speed">
              <IconSpeed size={14} />
              <select
                className="ctrl-speed-select"
                value={speed}
                onChange={(e) => {
                  bumpControls();
                  onSpeedChange(Number(e.target.value));
                }}
                aria-label="Playback speed"
              >
                {speeds.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate === 1 ? "1x" : `${rate}x`}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="ctrl-btn ctrl-btn-icon ctrl-fs"
              onClick={() => {
                bumpControls();
                toggleFs();
              }}
              aria-label={isFs ? "Exit full screen" : "Full screen"}
              title={isFs ? "Exit full screen" : "Full screen"}
            >
              {isFs ? <IconFullscreenExit /> : <IconFullscreen />}
            </button>
          </div>
        </div>
    </div>
  )
}

export default VideoPlayerYoutube
