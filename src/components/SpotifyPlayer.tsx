"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play, Pause } from "lucide-react";

// Extracted from the playlist share URL: open.spotify.com/playlist/<id>?...
const PLAYLIST_URI = "spotify:playlist:6deF0SrsAtst8LGP7dxam7";
const SCRIPT_ID = "spotify-iframe-api-script";
const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v1";

type SpotifyController = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  addListener: (event: "ready" | "playback_update", cb: (e: { data: { isPaused: boolean } }) => void) => void;
  destroy: () => void;
};

type SpotifyIFrameAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string },
    callback: (controller: SpotifyController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIFrameAPI) => void;
    __spotifyIFrameAPI?: SpotifyIFrameAPI;
  }
}

export function SpotifyPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function createController(IFrameAPI: SpotifyIFrameAPI) {
      if (cancelled || !containerRef.current || controllerRef.current) return;

      // createController() replaces whatever element it's given with an iframe
      // outright (rather than inserting into it). If we handed it a React-owned
      // node, React would still believe that node is mounted and later throw
      // NotFoundError when reconciling (e.g. on route navigation), since the node
      // is gone from the DOM. So we hand it a plain node created outside React's
      // tracking, inside a stable wrapper React never touches again.
      const wrapper = containerRef.current;
      const mountNode = document.createElement("div");
      wrapper.appendChild(mountNode);

      // Spotify's iframe ships with loading="lazy". Since our wrapper sits
      // off-viewport at 1x1px, the browser's intersection heuristic never loads
      // it on its own — force eager loading the moment the iframe lands.
      const observer = new MutationObserver(() => {
        const iframe = wrapper.querySelector("iframe");
        if (iframe) {
          iframe.loading = "eager";
          observer.disconnect();
        }
      });
      observer.observe(wrapper, { childList: true });

      IFrameAPI.createController(mountNode, { uri: PLAYLIST_URI }, (controller) => {
        if (cancelled) {
          controller.destroy();
          return;
        }
        controllerRef.current = controller;
        controller.addListener("ready", () => setReady(true));
        controller.addListener("playback_update", (e) => setIsPlaying(!e.data.isPaused));
      });
    }

    if (window.__spotifyIFrameAPI) {
      createController(window.__spotifyIFrameAPI);
    } else {
      const previous = window.onSpotifyIframeApiReady;
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        window.__spotifyIFrameAPI = IFrameAPI;
        previous?.(IFrameAPI);
        createController(IFrameAPI);
      };

      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* Always mounted (so playback/controller state survives toggling) — visibility
          is purely a CSS/animation state, driven by isPlaying below. */}
      <motion.div
        ref={containerRef}
        aria-hidden={!isPlaying}
        className="fixed bottom-24 right-6 z-40 w-[300px] overflow-hidden rounded-card bg-ink shadow-lg shadow-ink/10"
        style={{ pointerEvents: isPlaying ? "auto" : "none" }}
        initial={false}
        animate={isPlaying ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          type="button"
          onClick={() => controllerRef.current?.togglePlay()}
          disabled={!ready}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
          whileHover={ready ? { scale: 1.05 } : undefined}
          whileTap={ready ? { scale: 0.95 } : undefined}
          transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
          className="grain-surface flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-lg shadow-ink/10 disabled:opacity-40"
        >
          {isPlaying ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
        </motion.button>
      </div>
    </>
  );
}
