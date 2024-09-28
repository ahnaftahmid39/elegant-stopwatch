import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useInterval from "@/hooks/use-interval";
import {
  MoonIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Card } from "./components/ui/card";
import { useHotkeys } from "react-hotkeys-hook";

const zeroPad = (num: number) => String(num).padStart(2, "0");

function formatSeconds(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  // const milisecs = (ms % 1000) / 10;

  // If there are hours, use hh:mm:ss format
  if (hours > 0) return [hours, minutes, secs].map((t) => zeroPad(t)).join(":");
  // If no hours, use mm:ss format
  else return [minutes, secs].map((t) => zeroPad(t)).join(":");
}
const THEME_TYPES = {
  LIGHT: "light",
  DARK: "dark",
};

const App = () => {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ms, setMs] = useState<number>(0);

  const [theme, setTheme] = useState(THEME_TYPES.DARK);

  useEffect(() => {
    const { DARK, LIGHT } = THEME_TYPES;
    const root = window.document.documentElement;
    const isDark = theme === DARK;
    root.classList.remove(isDark ? LIGHT : DARK);
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const { DARK, LIGHT } = THEME_TYPES;
    if (theme === DARK) setTheme(LIGHT);
    if (theme === LIGHT) setTheme(DARK);
  };

  useInterval({
    callback: () => {
      setMs(ms + 1000);
    },
    delay: !started || paused ? null : 1000,
    immediate: true,
  });

  const startTimer = () => {
    setStarted(true);
  };

  const resetTimer = () => {
    setStarted(false);
    setPaused(false);
    setMs(0);
  };
  const toggleTimer = () => {
    if (started) resetTimer();
    else startTimer();
  };
  const pauseTimer = () => {
    setPaused(true);
  };

  const unpauseTimer = () => {
    setPaused(false);
  };

  const togglePause = () => {
    if (!started) {
      startTimer();
      return;
    }
    if (paused) unpauseTimer();
    else pauseTimer();
  };

  useHotkeys<HTMLDivElement>("space", togglePause, {
    keyup: true,
    preventDefault: true,
  });

  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex-grow flex items-center justify-center">
        <button
          onClick={togglePause}
          className="focus:outline-none p-4 text-card-foreground text-6xl x-sm:text-7xl sm:text-9xl"
        >
          {formatSeconds(ms)}
        </button>
      </div>
      <nav className="flex">
        <Card className="p-2 sm:p-4 bg-card text-card-foreground border rounded-md mb-5 mx-auto flex gap-2">
          <Button variant={"outline"} onClick={toggleTimer}>
            {started ? (
              <>
                <ResetIcon className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </>
            ) : (
              <>
                <PlayIcon className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Start</span>
              </>
            )}
          </Button>
          <Button variant={"outline"} disabled={!started} onClick={togglePause}>
            {paused ? (
              <>
                <PlayIcon className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Unpause</span>
              </>
            ) : (
              <>
                <PauseIcon className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Pause</span>
              </>
            )}
          </Button>
          <Button variant={"outline"} onClick={toggleTheme}>
            {theme === THEME_TYPES.LIGHT ? (
              <>
                <SunIcon className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <MoonIcon className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </Button>
        </Card>
      </nav>
    </div>
  );
};

export default App;
