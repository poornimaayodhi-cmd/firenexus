import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { SIMULATION_STEPS_DEFINITION } from '../../data/mockData';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Sparkles,
} from 'lucide-react';

export const SimulationBar: React.FC = () => {
  const {
    currentStepIndex,
    currentStep,
    stateMachine,
    isPlaying,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    goToStep,
    nextStep,
    prevStep,
    simulationSpeed,
    setSimulationSpeed,
    isAiSynthesizing,
    triggerAiSceneSynthesis,
  } = useSimulation();

  return (
    <div className="bg-slate-900/95 border-b border-slate-800/80 px-3 sm:px-4 py-2 sm:py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
        {/* Playback Controls & Step Index */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800 shrink-0">
            <button
              onClick={resetSimulation}
              title="Reset to Step 1 (Normal baseline)"
              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={prevStep}
              disabled={currentStepIndex <= 1}
              title="Previous Step"
              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            {isPlaying ? (
              <button
                onClick={pauseSimulation}
                title="Pause Incident Evolution"
                className="px-2.5 py-1 min-h-[32px] text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={startSimulation}
                title="Start Incident Evolution"
                className="px-2.5 py-1 min-h-[32px] text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{currentStepIndex === 1 ? 'Start Incident' : 'Resume'}</span>
              </button>
            )}

            <button
              onClick={nextStep}
              disabled={currentStepIndex >= SIMULATION_STEPS_DEFINITION.length}
              title="Next Step"
              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Toggle */}
          <button
            onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : 1)}
            className="px-2 py-1 min-h-[32px] bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[11px] font-mono font-medium text-slate-300 flex items-center gap-1 cursor-pointer"
            title="Toggle playback rate"
          >
            <FastForward className="w-3 h-3 text-rose-400" />
            <span>{simulationSpeed}x Speed</span>
          </button>

          {/* AI Reasoning Trigger */}
          <button
            onClick={triggerAiSceneSynthesis}
            disabled={isAiSynthesizing}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 min-h-[32px] bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800/80 hover:to-purple-800/80 border border-indigo-700/50 rounded text-xs font-medium text-indigo-200 transition-colors cursor-pointer"
            title="Generate multi-camera AI reasoning synthesis"
          >
            <Sparkles className="w-3 h-3 text-indigo-300" />
            <span>{isAiSynthesizing ? 'Synthesizing...' : 'AI Scene Synthesis'}</span>
          </button>
        </div>

        {/* Step Indicator & Timeline Scrubber */}
        <div className="flex-1 lg:max-w-2xl flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-rose-400 font-bold">
                STAGE {currentStepIndex} OF {SIMULATION_STEPS_DEFINITION.length}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-amber-300 uppercase">
                {stateMachine.replace('_', ' ')}
              </span>
              <span className="text-slate-400 font-medium truncate max-w-xs sm:max-w-md hidden md:inline">
                — {currentStep.stepName}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Confidence: <strong className="text-slate-200">{currentStep.incidentConfidence}%</strong>
            </span>
          </div>

          {/* Step Pill Track */}
          <div className="grid grid-cols-9 gap-1">
            {SIMULATION_STEPS_DEFINITION.map((s) => {
              const isCurrent = s.stepIndex === currentStepIndex;
              const isPast = s.stepIndex < currentStepIndex;
              return (
                <button
                  key={s.stepIndex}
                  onClick={() => goToStep(s.stepIndex)}
                  title={`Stage ${s.stepIndex}: ${s.stepName} (${s.stateMachine})`}
                  className={`h-3.5 sm:h-2.5 rounded transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-rose-500 ring-2 ring-rose-400/40 shadow-sm'
                      : isPast
                      ? 'bg-rose-900/60 hover:bg-rose-800'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`Go to Stage ${s.stepIndex}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
