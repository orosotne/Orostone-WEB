import React from 'react';
import { motion } from 'framer-motion';

type ShapeType = 'straight' | 'l-shape' | 'u-shape' | 'island';

interface Dimensions {
    a: number; // Length (cm)
    b: number; // Depth or second length (cm)
    c?: number; // Third length for U-shape (cm)
    depth: number; // Standard depth (cm)
}

interface Step1Props {
    shape: ShapeType;
    setShape: (s: ShapeType) => void;
    dimensions: Dimensions;
    setDimensions: (d: Dimensions) => void;
    setNextDisabled: (disabled: boolean) => void;
}

export const Step1Shape: React.FC<Step1Props> = ({ shape, setShape, dimensions, setDimensions, setNextDisabled }) => {

    const handleShapeChange = (newShape: ShapeType) => {
        setShape(newShape);
        // Reset depth to 60 for straight, L, and U shapes, but 0 for island
        if (newShape === 'island') {
            setDimensions({ ...dimensions, depth: 0, b: 0, c: 0 });
        } else if (shape === 'island') {
            // Coming from island, set default depth
            setDimensions({ ...dimensions, depth: 60 });
        }
    };

    const handleDimensionChange = (field: keyof Dimensions, value: string) => {
        const num = parseFloat(value) || 0;
        const newDims = { ...dimensions, [field]: num };
        setDimensions(newDims);

        // Simple validation
        const isValid = newDims.a > 0 && newDims.depth > 0 &&
            (shape !== 'l-shape' || newDims.b > 0) &&
            (shape !== 'u-shape' || (newDims.b > 0 && (newDims.c || 0) > 0));

        setNextDisabled(!isValid);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Shape Selection */}
            <div>
                <h3 className="text-xl font-light mb-6 text-brand-dark">1. Vyberte tvar kuchyne</h3>
                <div className="grid grid-cols-2 gap-4">
                    <ShapeOption
                        active={shape === 'straight'}
                        onClick={() => handleShapeChange('straight')}
                        label="Rovná"
                        icon={<div className="w-12 h-4 bg-current rounded-sm" />}
                    />
                    <ShapeOption
                        active={shape === 'l-shape'}
                        onClick={() => handleShapeChange('l-shape')}
                        label="Tvar L"
                        icon={<div className="w-8 h-8 border-l-4 border-b-4 border-current rounded-sm translate-x-2 -translate-y-2" />}
                    />
                    <ShapeOption
                        active={shape === 'u-shape'}
                        onClick={() => handleShapeChange('u-shape')}
                        label="Tvar U"
                        icon={<div className="w-8 h-8 border-l-4 border-b-4 border-r-4 border-current rounded-sm -translate-y-2" />}
                    />
                    <ShapeOption
                        active={shape === 'island'}
                        onClick={() => handleShapeChange('island')}
                        label="Ostrovček"
                        icon={<div className="w-10 h-6 border-4 border-current rounded-sm" />}
                    />
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-light mb-4 text-brand-dark">2. Zadajte rozmery (cm)</h3>
                    <div className="space-y-4">
                        <InputGroup label="Dĺžka A" value={dimensions.a} onChange={(v) => handleDimensionChange('a', v)} />
                        <InputGroup label="Hĺbka (štandard 60)" value={dimensions.depth} onChange={(v) => handleDimensionChange('depth', v)} />

                        {(shape === 'l-shape' || shape === 'u-shape') && (
                            <InputGroup label="Dĺžka B" value={dimensions.b} onChange={(v) => handleDimensionChange('b', v)} />
                        )}
                        {shape === 'u-shape' && (
                            <InputGroup label="Dĺžka C" value={dimensions.c || 0} onChange={(v) => handleDimensionChange('c', v)} />
                        )}
                        {shape === 'island' && (
                            <InputGroup label="Šírka Ostrova" value={dimensions.b} onChange={(v) => handleDimensionChange('b', v)} />
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Visualization */}
            <div className="bg-gray-50 flex items-center justify-center p-8 rounded-orostone border border-gray-100 min-h-[400px]">
                <div className="w-full h-full relative flex items-center justify-center">
                    {/* Very Basic SVG Visualization - replace with better one later */}
                    <svg viewBox="0 0 200 200" className="w-64 h-64 text-brand-dark fill-gray-200 stroke-brand-dark stroke-2">
                        {shape === 'straight' && (
                            <rect x="20" y="90" width="160" height="40" />
                        )}
                        {shape === 'l-shape' && (
                            <path d="M20,20 V180 H120 V140 H60 V20 Z" />
                        )}
                        {shape === 'u-shape' && (
                            <path d="M20,20 V180 H180 V20 H140 V140 H60 V20 Z" />
                        )}
                        {shape === 'island' && (
                            <rect x="40" y="60" width="120" height="80" />
                        )}
                        <text x="100" y="195" textAnchor="middle" className="text-xs fill-black stroke-none">{dimensions.a} cm</text>
                    </svg>
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-orostone shadow text-xs font-bold text-gray-500">
                        Plocha: {calculateArea(shape, dimensions).toFixed(2)} m²
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper components
const ShapeOption = ({ active, onClick, label, icon }: any) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 border-2 rounded-orostone transition-all duration-200 ${active ? 'border-brand-gold bg-brand-gold/5 text-brand-gold' : 'border-gray-100 hover:border-brand-gold/50 text-gray-400'
            }`}
    >
        <div className="mb-2">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const InputGroup = ({ label, value, onChange }: any) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-gray-600 font-medium">{label}</label>
        <div className="relative flex items-center gap-2">
            <input
                type="number"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-24 p-2 border border-gray-200 rounded-orostone focus:border-brand-gold focus:outline-none text-right font-mono"
                placeholder="0"
            />
            <span className="text-gray-400 text-sm min-w-[2rem]">cm</span>
        </div>
    </div>
);

// Simple util to calc area for preview (move to util file later)
const calculateArea = (shape: ShapeType, d: Dimensions) => {
    // Basic estimation
    const depthM = d.depth / 100;
    const aM = d.a / 100;
    const bM = d.b / 100;
    const cM = (d.c || 0) / 100;

    let area = 0;
    if (shape === 'straight') area = aM * depthM;
    else if (shape === 'l-shape') area = (aM * depthM) + ((bM - depthM) * depthM); // Simplify overlap
    else if (shape === 'u-shape') area = (aM * depthM) + ((bM - depthM) * depthM) + ((cM - depthM) * depthM);
    else if (shape === 'island') area = aM * bM;

    return Math.max(0, area);
};
