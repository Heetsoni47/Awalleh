import { useEffect, useState } from 'react';
import { initDb, db, MODE } from './lib/db';
import { joinRoom, once } from './lib/engine';
import Home from './components/Home';
import Room from './components/Room';
import { ToastHost } from './components/ui';

const SESSION_KEY = 'walleh-session';
const readSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; } };

export default function App() {
  const [ready, setReady] = useState(false);
  const [fatal, setFatal] = useState(null);
  const [code, setCode] = useState(null);
  const urlRoom = new URLSearchParams(location.search).get('room')?.toUpperCase() || '';

  useEffect(() => {
    initDb()
      .then(async () => {
        // Auto-reconnect: if this browser was already in this room, rejoin silently.
        const s = readSession();
        const target = urlRoom || s?.code;
        if (target && s?.code === target) {
          const member = await once(`rooms/${target}/members/${db.uid}`);
          if (member) { await joinRoom(target, member.name).catch(() => {}); setCode(target); }
        }
        setReady(true);
      })
      .catch((e) => { console.error(e); setFatal(e.message || String(e)); });
  }, []);

  const enter = (c, name) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ code: c, name }));
    localStorage.setItem('walleh-name', name);
    history.replaceState(null, '', `?room=${c}`);
    setCode(c);
  };
  const exit = () => {
    localStorage.removeItem(SESSION_KEY);
    history.replaceState(null, '', location.pathname);
    setCode(null);
  };

  if (fatal) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="panel max-w-md p-6">
          <h1 className="text-[17px] font-medium">Couldn't connect to the database</h1>
          <p className="mt-2 text-fg-2">{fatal}</p>
          <p className="mt-3 text-[13px] text-fg-3">Check firebase-config.js and that Anonymous sign-in is enabled in Firebase Authentication.</p>
          <button className="btn mt-4" onClick={() => location.reload()}>Try again</button>
        </div>
      </div>
    );
  }
  if (!ready) return <div className="flex min-h-dvh items-center justify-center text-fg-3">Connecting</div>;
  return (
    <ToastHost>
      {code ? <Room code={code} onExit={exit} /> : <Home initialCode={urlRoom} onEnter={enter} mode={MODE} />}
    </ToastHost>
  );
}
