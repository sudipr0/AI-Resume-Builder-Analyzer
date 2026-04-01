// src/components/section/CompletionBadge.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Star, Trophy, Crown, Sparkles, Zap, Target } from 'lucide-react';

const CompletionBadge = ({
    type = 'default',
    size = 'md',
    animate = true,
    showLabel = true,
    score = 100,
    className = ''
}) => {
    const badges = {
        default: {
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-100',
            label: 'Completed'
        },
        gold: {
            icon: Trophy,
            color: 'text-yellow-500',
            bg: 'bg-yellow-100',
            label: 'Gold'
        },
        silver: {
            icon: Award,
            color: 'text-gray-400',
            bg: 'bg-gray-100',
            label: 'Silver'
        },
        bronze: {
            icon: Star,
            color: 'text-amber-600',
            bg: 'bg-amber-100',
            label: 'Bronze'
        },
        expert: {
            icon: Crown,
            color: 'text-purple-500',
            bg: 'bg-purple-100',
            label: 'Expert'
        },
        pro: {
            icon: Zap,
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            label: 'Pro'
        },
        master: {
            icon: Target,
            color: 'text-red-500',
            bg: 'bg-red-100',
            label: 'Master'
        },
        ai: {
            icon: Sparkles,
            color: 'text-indigo-500',
            bg: 'bg-indigo-100',
            label: 'AI Enhanced'
        }
    };

    const selected = badges[type] || badges.default;
    const Icon = selected.icon;

    const sizes = {
        sm: {
            container: 'w-16 h-16',
            icon: 'w-6 h-6',
            text: 'text-xs'
        },
        md: {
            container: 'w-20 h-20',
            icon: 'w-8 h-8',
            text: 'text-sm'
        },
        lg: {
            container: 'w-24 h-24',
            icon: 'w-10 h-10',
            text: 'text-base'
        },
        xl: {
            container: 'w-32 h-32',
            icon: 'w-12 h-12',
            text: 'text-lg'
        }
    };

    const sizeClasses = sizes[size] || sizes.md;

    return (
        <motion.div
            initial={animate ? { scale: 0, rotate: -180 } : false}
            animate={animate ? { scale: 1, rotate: 0 } : false}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1
            }}
            className={`flex flex-col items-center justify-center ${className}`}
        >
            <motion.div
                whileHover={animate ? { scale: 1.1, rotate: 5 } : {}}
                whileTap={animate ? { scale: 0.95 } : {}}
                className={`relative ${sizeClasses.container} ${selected.bg} rounded-2xl flex items-center justify-center shadow-lg overflow-hidden`}
            >
                {/* Background shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                />

                {/* Icon */}
                <Icon className={`${sizeClasses.icon} ${selected.color} relative z-10`} />

                {/* Score indicator (if score provided) */}
                {score && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
                    >
                        {score}%
                    </motion.div>
                )}
            </motion.div>

            {/* Label */}
            {showLabel && (
                <motion.span
                    initial={animate ? { opacity: 0, y: 10 } : false}
                    animate={animate ? { opacity: 1, y: 0 } : false}
                    transition={{ delay: 0.2 }}
                    className={`mt-2 font-medium ${selected.color} ${sizeClasses.text}`}
                >
                    {selected.label}
                </motion.span>
            )}
        </motion.div>
    );
};

export default React.memo(CompletionBadge);