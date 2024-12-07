// MarkdownTypewriter.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Types and Interfaces
interface CursorStyle {
  shape: 'block' | 'line' | 'underscore' | 'custom';
  customContent?: string;
  width?: string;
  height?: string;
  color?: string;
  blinkSpeed?: number;
}

interface MarkdownTypewriterProps {
  content: string;
  typeSpeed?: number;
  initialDelay?: number;
  onComplete?: () => void;
  className?: string;
  cursor?: CursorStyle | false;
}

interface Segment {
  type: 'text' | 'html';
  content: string;
  length: number;
}

interface TypewriterState {
  segments: Segment[];
  currentSegmentIndex: number;
  currentCharIndex: number;
  isStarted: boolean;
  showCursor: boolean;
}

// Predefined cursor styles
export const cursorPresets: Record<string, CursorStyle> = {
  block: {
    shape: 'block',
    width: '2px',
    height: '16px',
    color: 'black',
    blinkSpeed: 530
  },
  line: {
    shape: 'line',
    width: '1px',
    height: '16px',
    color: 'black',
    blinkSpeed: 530
  },
  underscore: {
    shape: 'underscore',
    width: '8px',
    height: '1px',
    color: 'black',
    blinkSpeed: 530
  }
};

// Markdown processing rules
interface MarkdownRule {
  pattern: RegExp;
  replacement: string | ((match: string, ...args: string[]) => string);
}

const markdownRules: MarkdownRule[] = [
  // Headers
  {
    pattern: /^(#{1,6})\s(.+)$/gm,
    replacement: (match: string, hashes: string, content: string) => {
      const level = hashes.length;
      const size = {
        1: '32px',
        2: '24px',
        3: '20px',
        4: '16px',
        5: '14px',
        6: '12px'
      }[level as 1|2|3|4|5|6] || '12px';
      return `<h${level} style="font-weight:bold;font-size:${size};margin-bottom:1rem;">${content}</h${level}>`;
    }
  },
  // Bold
  {
    pattern: /\*\*(.*?)\*\*/g,
    replacement: '<strong>$1</strong>'
  },
  // Italic
  {
    pattern: /\*(.*?)\*/g,
    replacement: '<em>$1</em>'
  },
  // Code blocks
  {
    pattern: /```([\s\S]*?)```/g,
    replacement: (match: string, code: string) =>
      `<pre style="background-color:#f3f4f6;padding:1rem;border-radius:0.5rem;margin:1rem 0;font-family:monospace;font-size:0.875rem;overflow-x:auto;">${code.trim()}</pre>`
  },
  // Inline code
  {
    pattern: /`([^`]+)`/g,
    replacement: '<code style="background-color:#f3f4f6;padding:0 0.25rem;border-radius:0.25rem;font-family:monospace;font-size:0.875rem;">$1</code>'
  },
  // Blockquotes
  {
    pattern: /^>\s(.+)$/gm,
    replacement: '<blockquote style="border-left:4px solid #d1d5db;padding-left:1rem;padding-top:0.5rem;padding-bottom:0.5rem;margin:1rem 0;font-style:italic;">$1</blockquote>'
  },
  // Lists
  {
    pattern: /^[-*]\s(.+)$/gm,
    replacement: '<li style="margin-left:1rem;">$1</li>'
  },
  // Links
  {
    pattern: /\[(.*?)\]\((.*?)\)/g,
    replacement: '<a href="$2" style="color:#2563eb;text-decoration:underline;">$1</a>'
  },
  // Line breaks
  {
    pattern: /\n/g,
    replacement: '<br>'
  },
];

// Cursor Component
const Cursor = ({
  style,
  visible
}: {
  style: CursorStyle;
  visible: boolean;
}) => {
  if (style.shape === 'custom' && style.customContent) {
    return (
      <span
        style={{
          marginLeft: '4px',
          opacity: visible ? '1' : '0',
          transition: `opacity ${style.blinkSpeed || 530}ms`,
          color: style.color || 'black'
        }}
      >
        {style.customContent}
      </span>
    );
  }

  return <span style={{
    marginLeft: '4px',
    display: 'inline-block',
    width: style.width || '2px',
    height: style.height || '16px',
    backgroundColor: style.color || 'black',
    opacity: visible ? '1' : '0'
  }} aria-hidden="true" />;
};

// Utility functions
const mergeCursorStyles = (customStyle: Partial<CursorStyle>): CursorStyle => {
  const baseStyle = cursorPresets[customStyle.shape || 'block'];
  return { ...baseStyle, ...customStyle };
};

const processMarkdown = (text: string): string => {
  let processed = text;
  markdownRules.forEach(rule => {
    processed = processed.replace(rule.pattern, rule.replacement as string);
  });
  return processed;
};

// Main Component
const MarkdownTypewriter = ({
  content,
  typeSpeed = 50,
  initialDelay = 500,
  onComplete,
  className = '',
  cursor = cursorPresets.block
}: MarkdownTypewriterProps) => {
  const [state, setState] = useState<TypewriterState>({
    segments: [],
    currentSegmentIndex: 0,
    currentCharIndex: 0,
    isStarted: false,
    showCursor: true
  });

  const processContent = useCallback((markdown: string): Segment[] => {
    const processed = processMarkdown(markdown);
    const segments: Segment[] = [];
    const tagRegex = /<[^>]+>/g;
    let match;
    let lastIndex = 0;

    while ((match = tagRegex.exec(processed)) !== null) {
      if (match.index > lastIndex) {
        const textContent = processed.slice(lastIndex, match.index);
        if (textContent) {
          segments.push({
            type: 'text',
            content: textContent,
            length: textContent.length
          });
        }
      }

      segments.push({
        type: 'html',
        content: match[0],
        length: 1
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < processed.length) {
      segments.push({
        type: 'text',
        content: processed.slice(lastIndex),
        length: processed.length - lastIndex
      });
    }

    return segments;
  }, []);

  useEffect(() => {
    const processedSegments = processContent(content);
    setState(prev => ({
      ...prev,
      segments: processedSegments
    }));
  }, [content, processContent]);

  useEffect(() => {
    if (state.segments.length === 0) return;

    const startTimeout = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isStarted: true
      }));
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [state.segments, initialDelay]);

  useEffect(() => {
    if (!state.isStarted || state.segments.length === 0) return;

    const currentSegment = state.segments[state.currentSegmentIndex];
    if (!currentSegment) return;

    const isLastSegment = state.currentSegmentIndex === state.segments.length - 1;
    const isSegmentComplete = state.currentCharIndex >= currentSegment.length;

    if (isSegmentComplete) {
      if (isLastSegment) {
        onComplete?.();
        return;
      }

      const timeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentSegmentIndex: prev.currentSegmentIndex + 1,
          currentCharIndex: 0
        }));
      }, typeSpeed);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentCharIndex: prev.currentCharIndex + 1
      }));
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [state, typeSpeed, onComplete]);

  useEffect(() => {
    if (!cursor) return;

    const cursorStyle = typeof cursor === 'object' ? mergeCursorStyles(cursor) : cursorPresets.block;
    const blinkSpeed = cursorStyle.blinkSpeed || 530;

    const cursorInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        showCursor: !prev.showCursor
      }));
    }, blinkSpeed);

    return () => clearInterval(cursorInterval);
  }, [cursor]);

  const renderContent = useMemo(() => {
    return state.segments.map((segment, segmentIndex) => {
      if (segmentIndex > state.currentSegmentIndex) {
        return null;
      }

      if (segmentIndex === state.currentSegmentIndex) {
        if (segment.type === 'html') {
          return segment.content;
        }
        return segment.content.slice(0, state.currentCharIndex);
      }

      return segment.content;
    }).join('');
  }, [state.segments, state.currentSegmentIndex, state.currentCharIndex]);

  const isTypingComplete = useMemo(() => {
    return (
      state.currentSegmentIndex === state.segments.length - 1 &&
      state.currentCharIndex >= (state.segments[state.currentSegmentIndex]?.length || 0)
    );
  }, [state]);

  return (
    <div style={{
      maxWidth: '768px',
      margin: 'auto',
      padding: '1rem'
    }}>
      <div
        dangerouslySetInnerHTML={{ __html: renderContent }}
        style={{
          display: 'inline'
        }}
      />
      {cursor && !isTypingComplete && (
        <Cursor
          style={typeof cursor === 'object' ? mergeCursorStyles(cursor) : cursorPresets.block}
          visible={state.showCursor}
        />
      )}
    </div>
  );
};

export default MarkdownTypewriter;
