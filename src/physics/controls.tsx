/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  Wind, 
  Flame, 
  Anchor, 
  Zap, 
  Sparkles, 
  VolumeX, 
  Volume2,
  Gauge,
  Cpu,
  Infinity as InfIcon,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { PhysicsConfig } from './engine';

interface PhysicsControlsProps {
  config: PhysicsConfig;
  onUpdateConfig: (updates: Partial<PhysicsConfig>) => void;
  onTriggerImpulse: () => void;
  onTriggerExplosionAtCenter: () => void;
  onReset: () => void;
  isFreeze: boolean;
  onToggleFreeze: (freeze: boolean) => void;
}

export default function PhysicsControls({
  config,
  onUpdateConfig,
  onTriggerImpulse,
  onTriggerExplosionAtCenter,
  onReset,
  isFreeze,
  onToggleFreeze
}: PhysicsControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-12 right-6 z-[100] flex flex-col items-end">
      {/* Floating Action Button for Settings Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all ${
          config.enabled 
            ? 'bg-brand-cyan text-slate-900 border-brand-cyan hover:scale-105 active:scale-95' 
            : 'bg-bg-dark-800 text-slate-400 border-white/10 hover:text-white'
        }`}
        title="Physics Sandbox Customizer"
      >
        <Sliders className={`w-5 h-5 ${config.enabled && !isFreeze ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
      </button>

      {/* Primary Sandbox Panel */}
      {isOpen && (
        <div className="w-80 bg-bg-dark-900/95 backdrop-blur-md border border-white/10 rounded-xl p-4 mt-3 shadow-2xl space-y-4 text-xs animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-brand-cyan" />
              Antigravity Engine
            </span>
            <span className={`w-2 h-2 rounded-full ${config.enabled ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
          </div>

          {/* Core Master On/Off Switch */}
          <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-lg p-2.5">
            <div>
              <span className="font-semibold text-slate-200 block">Antigravity Simulation</span>
              <span className="text-[10px] text-slate-500">Enable physical engine attributes</span>
            </div>
            <button
              onClick={() => onUpdateConfig({ enabled: !config.enabled })}
              className={`px-3 py-1.5 rounded font-bold transition-all text-[11px] ${
                config.enabled
                  ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {config.enabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {config.enabled && (
            <>
              {/* Gravity Presets */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-400 uppercase tracking-widest text-[9px] block">Gravity Presets</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'zero', label: 'Zero-G', icon: <InfIcon className="w-3.5 h-3.5" /> },
                    { id: 'moon', label: 'Moon', icon: <Moon className="w-3.5 h-3.5" /> },
                    { id: 'earth', label: 'Earth', icon: <Globe className="w-3.5 h-3.5" /> },
                    { id: 'jupiter', label: 'Jupiter', icon: <Anchor className="w-3.5 h-3.5" /> },
                    { id: 'reverse', label: 'Reverse', icon: <Play className="w-3.5 h-3.5 rotate-270" /> },
                    { id: 'wind', label: 'Windy', icon: <Wind className="w-3.5 h-3.5" /> }
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => onUpdateConfig({ gravityType: preset.id as any })}
                      className={`flex flex-col items-center justify-center p-2 rounded border gap-1 transition-all ${
                        config.gravityType === preset.id
                          ? 'bg-brand-cyan/15 border-brand-cyan/35 text-brand-cyan'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15 text-slate-400'
                      }`}
                    >
                      {preset.icon}
                      <span className="text-[9px] font-medium">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Properties Controls */}
              <div className="space-y-2.5 bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="font-semibold text-slate-400 uppercase tracking-widest text-[9px] block">Physics Parameters</span>
                
                {/* Elasticity (Bounce) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Elasticity (Bounce)</span>
                    <span className="text-brand-cyan font-mono">{config.elasticity.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={config.elasticity}
                    onChange={(e) => onUpdateConfig({ elasticity: parseFloat(e.target.value) })}
                    className="w-full accent-brand-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Air Friction */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Friction Coefficients</span>
                    <span className="text-brand-cyan font-mono">{config.friction.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.5"
                    step="0.05"
                    value={config.friction}
                    onChange={(e) => onUpdateConfig({ friction: parseFloat(e.target.value) })}
                    className="w-full accent-brand-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Additional Toggles */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => onUpdateConfig({ slowMotion: !config.slowMotion })}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all ${
                      config.slowMotion
                        ? 'bg-amber-400/10 text-amber-300 border-amber-500/20'
                        : 'bg-black/30 text-slate-400 border-white/10'
                    }`}
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>Slow Motion</span>
                  </button>

                  <button
                    onClick={() => onUpdateConfig({ magneticMode: !config.magneticMode })}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all ${
                      config.magneticMode
                        ? 'bg-brand-purple/10 text-brand-purple-light border-brand-purple-light/25'
                        : 'bg-black/30 text-slate-400 border-white/10'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Magnetic attraction</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-400 uppercase tracking-widest text-[9px] block">Trigger Sandbox Impacts</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onTriggerImpulse}
                    className="flex items-center justify-center gap-1 bg-brand-cyan text-slate-950 font-bold py-2 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_12px_rgba(0,212,255,0.2)]"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Random Wind Impulse
                  </button>
                  <button
                    onClick={onTriggerExplosionAtCenter}
                    className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    Detonate Core Blast
                  </button>
                </div>
              </div>

              {/* Control Modifiers */}
              <div className="flex gap-2">
                <button
                  onClick={() => onToggleFreeze(!isFreeze)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-bold transition-all ${
                    isFreeze 
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                      : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {isFreeze ? 'Unfreeze Physics' : 'Freeze Layout'}
                </button>
                <button
                  onClick={onReset}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-slate-300 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore layout
                </button>
              </div>

              {/* Help tip */}
              <div className="text-[10px] text-slate-500 leading-normal bg-black/40 p-2 rounded border border-white/5 text-center">
                💡 Try grabbing any visual card or panel and throw it across the workspace! Double-click elements to explode them.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
