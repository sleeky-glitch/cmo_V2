'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownViewer({ content = '' }: { content?: string }) {
  return (
    <div className="text-sm leading-6 text-gray-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-2 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold mt-2 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-semibold mt-2 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-3 text-gray-800" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-gray-900" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-3"
              {...props}
            />
          ),
          code: ({ inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code
                  className="px-1 py-0.5 rounded bg-gray-100 text-gray-900"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 overflow-x-auto mb-3">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            )
          },
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-gray-200" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
