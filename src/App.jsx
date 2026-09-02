import React, { useState } from 'react';
import './App.css';

const NOTES = [
  { name: 'C', freq: 261.63 },
  { name: 'G', freq: 392.00 },
  { name: 'D', freq: 293.66 },
  { name: 'A', freq: 440.00 },
  { name: 'E', freq: 329.63 },
  { name: 'B', freq: 493.88 },
  { name: 'F#', freq: 369.99 },
  { name: 'Db', freq: 277.18 },
  { name: 'Ab', freq: 415.30 },
  { name: 'Eb', freq: 311.13 },
  { name: 'Bb', freq: 466.16 },
  { name: 'F', freq: 349.23 },
];

export default function App() {
  const [activeNote, setActiveNote] = useState(null);
  const [mode, setMode] = useState('normal'); // 'normal' ou 'polygon'
  
  // Polygones validés
  const [polygons, setPolygons] = useState([]);
  
  // Polygone en cours de dessin : [{ x, y, noteName }, ...]
  const [currentPolygon, setCurrentPolygon] = useState([]);
  
  // Position actuelle de la souris pour la ligne élastique
  const [mousePos, setMousePos] = useState(null);

  // Synthèse audio Web Audio API
  const playSound = (freq, name) => {
    setActiveNote(name);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  };

  const playPolygon = (polygon) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const startTime = audioCtx.currentTime;
    const noteGain = 0.3 / polygon.length;

    polygon.forEach(({ noteName }) => {
      const note = NOTES.find(({ name }) => name === noteName);
      if (!note) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, startTime);
      gain.gain.setValueAtTime(noteGain, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  };

  // Clic sur une note
  const handleNoteClick = (note, point, e) => {
    e.stopPropagation();
    playSound(note.freq, note.name);

    if (mode === 'polygon') {
      // 1. Si on a déjà commencé un polygone et qu'on re-clique sur la note de DÉPART
      if (
        currentPolygon.length > 0 &&
        currentPolygon[0].noteName === note.name
      ) {
        // Valide le polygone si on a au moins 3 sommets uniques
        if (currentPolygon.length >= 3) {
          setPolygons((prev) => [...prev, currentPolygon]);
        }
        // Réinitialise le polygone en cours
        setCurrentPolygon([]);
        setMousePos(null);
        return;
      }

      // 2. Sinon, ajoute la note au polygone en cours
      if (currentPolygon.length === 0) {
        setPolygons([]);
      }
      setCurrentPolygon((prev) => [...prev, { ...point, noteName: note.name }]);
    }
  };

  // Suivi du pointeur pour la ligne élastique
  const handleMouseMove = (e) => {
    if (mode !== 'polygon' || currentPolygon.length === 0) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;

    const x = (e.clientX - rect.left) * scaleX - 200;
    const y = (e.clientY - rect.top) * scaleY - 200;

    setMousePos({ x, y });
  };

  // Supprimer un polygone spécifique
  const deletePolygon = (indexToDelete) => {
    setPolygons((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '30px 20px' }}>
      <h1 style={{ marginBottom: '8px' }}>Circle of Fifths</h1>
      <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>
        Harmony viewed through the prism of geometry
      </p>

      {/* Barre d'outils / Modes */}
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button
          onClick={() => {
            setMode('normal');
            setCurrentPolygon([]);
          }}
          style={{
            padding: '10px 18px',
            borderRadius: '6px',
            border: '2px solid #4a90e2',
            backgroundColor: mode === 'normal' ? '#4a90e2' : '#ffffff',
            color: mode === 'normal' ? '#ffffff' : '#4a90e2',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Normal Mode
        </button>

        <button
          onClick={() => setMode('polygon')}
          style={{
            padding: '10px 18px',
            borderRadius: '6px',
            border: '2px solid #e74c3c',
            backgroundColor: mode === 'polygon' ? '#ffffff' : '#e74c3c',
            color: mode === 'polygon' ? '#e74c3c' : '#ffffff',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Polygon Mode
        </button>
      </div>

      {/* Zone d'affichage SVG */}
      <div className="circle-stage">
        <svg
          width="440"
          height="440"
          viewBox="-220 -220 440 440"
          onMouseMove={handleMouseMove}
          style={{ maxWidth: '100%', userSelect: 'none' }}
        >
        {/* Cercle de fond */}
        <circle r="170" fill="#f8f9fa" stroke="#4a90e2" strokeWidth="2" />

        {/* 1. Rendu des polygones terminés */}
        {polygons.map((poly, polyIdx) => {
          const pointsString = poly.map((p) => `${p.x},${p.y}`).join(' ');

          return (
            <g key={`poly-${polyIdx}`}>
              <polygon
                points={pointsString}
                fill="rgba(231, 76, 60, 0.2)"
                stroke="#e74c3c"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              
              {/* Croix de suppression : Fixe en haut à droite, hors du cercle */}
              <g
                onClick={() => deletePolygon(polyIdx)}
                style={{ cursor: 'pointer' }}
                transform={`translate(${150 - polyIdx * 28}, -175)`} // Décalage léger si plusieurs polygones
              >
                <circle cx="0" cy="0" r="11" fill="#e74c3c" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                >
                  ×
                </text>
              </g>
            </g>
          );
        })}

        {/* 2. Polygone en cours de tracé */}
        {currentPolygon.length > 0 && (
          <g>
            <polyline
              points={currentPolygon.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#e74c3c"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {mousePos && (
              <line
                x1={currentPolygon[currentPolygon.length - 1].x}
                y1={currentPolygon[currentPolygon.length - 1].y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="#e74c3c"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
            )}
          </g>
        )}

        {/* 3. Les 12 notes */}
        {NOTES.map((note, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const x = 125 * Math.cos(angle);
          const y = 125 * Math.sin(angle);
          const isSelected = activeNote === note.name;
          const isInCurrentPoly = currentPolygon.some((p) => p.noteName === note.name);
          const isStartNote =
            currentPolygon.length > 0 && currentPolygon[0].noteName === note.name;

          return (
            <g
              key={note.name}
              onClick={(e) => handleNoteClick(note, { x, y }, e)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={x}
                cy={y}
                r="26"
                fill={
                  isStartNote
                    ? '#27ae60' // Vert pour identifier la note de fermeture
                    : isInCurrentPoly
                    ? '#e74c3c'
                    : isSelected
                    ? '#4a90e2'
                    : '#ffffff'
                }
                stroke={
                  isStartNote
                    ? '#27ae60'
                    : isInCurrentPoly
                    ? '#e74c3c'
                    : '#4a90e2'
                }
                strokeWidth={isStartNote ? '3' : '2'}
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill={isSelected || isInCurrentPoly || isStartNote ? '#ffffff' : '#2c3e50'}
                fontWeight="bold"
                fontSize="16"
              >
                {note.name}
              </text>
            </g>
          );
        })}
        </svg>

        {polygons.length > 0 && (
          <button
            className="play-button"
            onClick={() => playPolygon(polygons[0])}
          >
            Lecture
          </button>
        )}
      </div>

      {/* Guide textuel */}
      <div style={{ marginTop: '15px', color: '#555', fontSize: '0.95rem' }}>
        {mode === 'polygon' ? (
          <p style={{ color: '#e74c3c' }}>
            <strong>Mode Polygone :</strong> Cliquez sur les notes pour tracer. Re-cliquez sur la <span style={{ color: '#27ae60', fontWeight: 'bold' }}>première note (en vert)</span> pour fermer la forme.
          </p>
        ) : (
          <p>Cliquez sur une note pour écouter sa fréquence audio.</p>
        )}
      </div>
    </div>
  );
}