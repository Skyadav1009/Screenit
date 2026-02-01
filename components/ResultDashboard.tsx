import React from 'react';
import { AnalysisResult } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { CheckCircle2, AlertTriangle, XCircle, Award, Target, BookOpen, ArrowRight, Zap } from 'lucide-react';

interface ResultDashboardProps {
  data: AnalysisResult;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ data }) => {
  const atsData = [
    { name: 'Score', value: data.atsScore.score },
    { name: 'Remaining', value: 100 - data.atsScore.score },
  ];

  const matchData = [
    { name: 'Match', value: data.jobMatch.matchPercentage },
    { name: 'Gap', value: 100 - data.jobMatch.matchPercentage },
  ];

  const COLORS = {
      score: data.atsScore.score > 75 ? '#10b981' : data.atsScore.score > 50 ? '#f59e0b' : '#ef4444',
      match: data.jobMatch.matchPercentage > 75 ? '#3b82f6' : data.jobMatch.matchPercentage > 50 ? '#8b5cf6' : '#ec4899',
      bg: '#333'
  };

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 custom-scrollbar">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ATS Score Card */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Target className="w-32 h-32" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" /> ATS Compatibility
          </h3>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={atsData}
                    innerRadius={45}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={COLORS.score} />
                    <Cell fill={COLORS.bg} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-white">{data.atsScore.score}</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-400 mb-2">Key Issues:</p>
                <ul className="space-y-1">
                    {data.atsScore.issues.slice(0, 3).map((issue, idx) => (
                        <li key={idx} className="text-xs flex items-start gap-2 text-red-300">
                             <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" /> {issue}
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>

        {/* Job Match Card */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
             <Award className="w-32 h-32" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" /> Job Match
          </h3>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matchData}
                    innerRadius={45}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={COLORS.match} />
                    <Cell fill={COLORS.bg} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-white">{data.jobMatch.matchPercentage}%</span>
                <span className="text-xs text-gray-500">Match</span>
              </div>
            </div>
             <div className="flex-1">
                <div className="mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Strong Match</p>
                    <div className="flex flex-wrap gap-1">
                        {data.jobMatch.strongMatches.slice(0, 3).map((m, i) => (
                            <span key={i} className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">{m}</span>
                        ))}
                    </div>
                </div>
                 <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Weak Areas</p>
                    <div className="flex flex-wrap gap-1">
                        {data.jobMatch.weakMatches.slice(0, 3).map((m, i) => (
                            <span key={i} className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">{m}</span>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Analysis */}
      <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-6">Keyword Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Matched
                </h4>
                <div className="flex flex-wrap gap-2">
                    {data.keywords.matched.length > 0 ? data.keywords.matched.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-300 text-xs rounded-md">
                            {kw}
                        </span>
                    )) : <span className="text-gray-500 text-xs italic">No exact matches found.</span>}
                </div>
            </div>
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Missing Critical
                </h4>
                 <div className="flex flex-wrap gap-2">
                    {data.keywords.missing.length > 0 ? data.keywords.missing.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-md">
                            {kw}
                        </span>
                    )) : <span className="text-gray-500 text-xs italic">All critical keywords present!</span>}
                </div>
            </div>
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Overused / Irrelevant
                </h4>
                 <div className="flex flex-wrap gap-2">
                    {data.keywords.overused.length > 0 ? data.keywords.overused.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs rounded-md">
                            {kw}
                        </span>
                    )) : <span className="text-gray-500 text-xs italic">No overused keywords detected.</span>}
                </div>
            </div>
        </div>
      </div>

      {/* Skill Gap & Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
               <h3 className="text-lg font-medium text-white mb-4">Skill Gap Analysis</h3>
               <div className="space-y-4">
                    <div>
                        <span className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Must Have Missing</span>
                         <div className="mt-2 flex flex-wrap gap-2">
                            {data.skillGap.missingMustHaves.length > 0 ? data.skillGap.missingMustHaves.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 bg-red-900/20 text-red-300 text-sm rounded border border-red-900/50">{s}</span>
                            )) : <span className="text-gray-500 text-sm">None!</span>}
                        </div>
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Nice To Have Missing</span>
                         <div className="mt-2 flex flex-wrap gap-2">
                            {data.skillGap.missingNiceToHaves.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 bg-blue-900/20 text-blue-300 text-sm rounded border border-blue-900/50">{s}</span>
                            ))}
                        </div>
                    </div>
               </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> Learning Priority
              </h3>
              <ul className="space-y-3">
                  {data.skillGap.learningPriority.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-mono">
                              {idx + 1}
                          </span>
                          {item}
                      </li>
                  ))}
              </ul>
          </div>
      </div>

      {/* Bullet Point Improvements */}
      <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-6">Content Optimization</h3>
        <div className="space-y-6">
            {data.bulletPoints.map((bp, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#252525] rounded-xl border border-[#333]">
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Original</span>
                        <p className="text-sm text-gray-400">{bp.original}</p>
                    </div>
                    <div className="space-y-2">
                         <span className="text-xs font-semibold text-green-400 uppercase tracking-wider flex items-center gap-1">
                             Improved <ArrowRight className="w-3 h-3" />
                         </span>
                        <p className="text-sm text-green-100/90 font-medium">{bp.improved}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

       {/* Detailed Section Feedback */}
       <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-6">Detailed Section Feedback</h3>
          <div className="space-y-4">
              {Object.entries(data.sectionFeedback).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-xl bg-[#2a2a2a] border border-[#383838]">
                      <h4 className="text-sm font-bold text-blue-300 uppercase mb-2">{key}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{value}</p>
                  </div>
              ))}
          </div>
       </div>

       {/* Final Verdict */}
       <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-[#444] rounded-2xl p-8 text-center relative overflow-hidden">
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
               <h2 className="text-2xl font-bold text-white">Career Readiness Verdict</h2>
               <div className="inline-block px-6 py-2 bg-white/10 rounded-full border border-white/20 text-white font-semibold tracking-wide">
                   {data.verdict.suitability}
               </div>
               
               <div className="text-left bg-black/20 rounded-xl p-6 mt-6">
                   <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Top Improvements Needed</h4>
                   <ul className="space-y-2">
                       {data.finalFeedback.topImprovements.map((imp, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                               <span className="text-blue-400">•</span> {imp}
                           </li>
                       ))}
                   </ul>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                   <div className="text-left">
                       <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Next Steps</h4>
                       {data.verdict.nextSteps.map((step, i) => (
                           <p key={i} className="text-sm text-gray-300 mb-1">→ {step}</p>
                       ))}
                   </div>
                    <div className="text-left">
                       <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Alternative Roles</h4>
                       <div className="flex flex-wrap gap-2">
                            {data.verdict.alternativeRoles.map((role, i) => (
                                <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-xs rounded text-gray-300">{role}</span>
                            ))}
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default ResultDashboard;
