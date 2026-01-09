import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  helperText?: string;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label, value, onChange, prefix, suffix, min = 0, max, helperText, disabled
}) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-xs font-bold text-hg-slate uppercase tracking-wider mb-2 ml-1 transition-colors group-hover:text-hg-navy">
          {label}
        </label>
      )}
      <div className={`
        relative flex items-center transition-all duration-200
        border-2 rounded-2xl overflow-hidden bg-white
        ${disabled
          ? 'bg-hg-gray/30 border-hg-navy/5 opacity-60'
          : 'border-hg-navy/10 hover:border-hg-navy/30 hover:shadow-md focus-within:border-hg-teal focus-within:ring-4 focus-within:ring-hg-teal/10 focus-within:shadow-lg'
        }
      `}>
        {prefix && (
          <span className={`pl-5 pr-1 text-xl font-bold select-none shrink-0 ${disabled ? 'text-hg-slate' : 'text-hg-navy/40'}`}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val)) val = 0;
            if (max !== undefined && val > max) val = max;
            if (val < min) val = min;
            onChange(val);
          }}
          disabled={disabled}
          placeholder="0"
          className={`
            flex-1 w-0 min-w-0 py-4 bg-transparent outline-none font-black text-2xl sm:text-3xl tracking-tight
            placeholder:text-hg-navy/10
            ${prefix ? 'pl-1' : 'pl-5'}
            ${suffix ? 'pr-1' : 'pr-5'}
            ${disabled ? 'text-hg-slate' : 'text-hg-navy'}
          `}
        />
        {suffix && (
          <div className="pr-4 pl-2 h-full flex items-center shrink-0 bg-hg-gray border-l border-hg-navy/5">
            <span className="text-xs font-bold text-hg-slate uppercase tracking-wider">
              {suffix}
            </span>
          </div>
        )}
      </div>
      {helperText && (
        <p className="mt-2 ml-1 text-xs text-hg-slate/80 font-medium leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label, value, onChange, placeholder, helperText, disabled
}) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-xs font-bold text-hg-slate uppercase tracking-wider mb-2 ml-1 transition-colors group-hover:text-hg-navy">
          {label}
        </label>
      )}
      <div className={`
        relative flex items-center transition-all duration-200
        border-2 rounded-2xl overflow-hidden bg-white
        ${disabled
          ? 'bg-hg-gray/30 border-hg-navy/5 opacity-60'
          : 'border-hg-navy/10 hover:border-hg-navy/30 hover:shadow-md focus-within:border-hg-teal focus-within:ring-4 focus-within:ring-hg-teal/10 focus-within:shadow-lg'
        }
      `}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder || ''}
          className={`
            flex-1 w-0 min-w-0 py-4 px-5 bg-transparent outline-none font-bold text-xl sm:text-2xl tracking-tight
            placeholder:text-hg-navy/20
            ${disabled ? 'text-hg-slate' : 'text-hg-navy'}
          `}
        />
      </div>
      {helperText && (
        <p className="mt-2 ml-1 text-xs text-hg-slate/80 font-medium leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
};