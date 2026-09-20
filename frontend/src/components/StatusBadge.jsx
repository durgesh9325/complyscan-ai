import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, HelpCircle } from 'lucide-react';

export function StatusBadge({ status, showLabel = true, size = 'md' }) {
  const configs = {
    PASS: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      label: 'COMPLIANT (PASS)',
      shortLabel: 'PASS',
      iconColor: 'text-emerald-600'
    },
    POSSIBLE_VIOLATION: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
      label: 'VIOLATION DETECTED',
      shortLabel: 'VIOLATION',
      iconColor: 'text-rose-600'
    },
    NEEDS_REVIEW: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      label: 'NEEDS REVIEW',
      shortLabel: 'REVIEW',
      iconColor: 'text-amber-600'
    },
    EXEMPT: {
      bg: 'bg-slate-50 text-slate-700 border-slate-200',
      icon: MinusCircle,
      label: 'EXEMPT PACKAGE',
      shortLabel: 'EXEMPT',
      iconColor: 'text-slate-500'
    },
    SKIPPED: {
      bg: 'bg-gray-50 text-gray-600 border-gray-200',
      icon: HelpCircle,
      label: 'NOT APPLICABLE',
      shortLabel: 'N/A',
      iconColor: 'text-gray-400'
    }
  };

  const config = configs[status] || configs.SKIPPED;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 space-x-2 font-bold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size] || sizeClasses.md} tracking-wide`}>
      <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
      {showLabel && <span>{size === 'sm' ? config.shortLabel : config.label}</span>}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const map = {
    HIGH: 'bg-rose-100 text-rose-800 border-rose-200',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
    LOW: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${map[severity] || 'bg-slate-100 text-slate-700'}`}>
      {severity}
    </span>
  );
}
