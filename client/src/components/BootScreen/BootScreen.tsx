import { useState, useEffect } from 'react';

interface BootScreenProps {
  onBootComplete: () => void;
}

const bootMessages = [
  'Checking system memory...',
  'Loading system files...',
  'Initializing hardware...',
  'Starting Windows 95...',
];

export function BootScreen({ onBootComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<'bios' | 'logo' | 'complete'>('bios');
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    // BIOS phase - show boot messages
    if (phase === 'bios') {
      const messageInterval = setInterval(() => {
        setCurrentMessage((prev) => {
          if (prev >= bootMessages.length - 1) {
            clearInterval(messageInterval);
            setTimeout(() => setPhase('logo'), 300);
            return prev;
          }
          return prev + 1;
        });
      }, 400);

      return () => clearInterval(messageInterval);
    }

    // Logo phase - show Windows logo with progress bar
    if (phase === 'logo') {
      const progressInterval = setInterval(() => {
        setProgressWidth((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setPhase('complete'), 200);
            return 100;
          }
          return prev + 4;
        });
      }, 50);

      return () => clearInterval(progressInterval);
    }

    // Complete - trigger callback
    if (phase === 'complete') {
      onBootComplete();
    }
  }, [phase, onBootComplete]);

  if (phase === 'bios') {
    return (
      <div className="boot-screen boot-bios">
        <div className="bios-content">
          <div className="bios-header">
            <span>AnomalyOS BIOS v1.0</span>
            <span>Copyright (C) 2024 Anomaly Systems</span>
          </div>
          <div className="bios-info">
            <div>CPU: Anomaly Processor 9000</div>
            <div>Memory: 640K Base, 15360K Extended</div>
            <div>&nbsp;</div>
          </div>
          <div className="bios-messages">
            {bootMessages.slice(0, currentMessage + 1).map((msg, index) => (
              <div key={index} className="bios-message">
                {msg}
                {index === currentMessage && (
                  <span className="bios-cursor">_</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'logo') {
    return (
      <div className="boot-screen boot-logo">
        <div className="logo-container">
          <div className="windows-flag">
            <div className="flag-row">
              <div className="flag-square flag-red"></div>
              <div className="flag-square flag-green"></div>
            </div>
            <div className="flag-row">
              <div className="flag-square flag-blue"></div>
              <div className="flag-square flag-yellow"></div>
            </div>
          </div>
          <div className="windows-text">
            <span className="windows-title">Windows</span>
            <span className="windows-version">95</span>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressWidth}%` }}
            >
              {Array.from({ length: Math.floor(progressWidth / 5) }).map(
                (_, i) => (
                  <div key={i} className="progress-block"></div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
