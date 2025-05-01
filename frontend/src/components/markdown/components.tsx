import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


export const components = {
    h1: ({ ...props }) => (
      <h1 className="text-4xl font-bold pb-2 my-4 text-gray-100" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-3xl font-semibold mt-6 mb-4 text-gray-200" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-2xl font-semibold mt-5 mb-3 text-gray-300" {...props} />
    ),
    h4: ({ ...props }) => (
      <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-300" {...props} />
    ),
    h5: ({ ...props }) => (
      <h5 className="text-lg font-semibold mt-3 mb-2 text-gray-300" {...props} />
    ),
    h6: ({ ...props }) => (
      <h6 className="text-base font-semibold mt-3 mb-2 text-gray-300" {...props} />
    ),
    p: ({ ...props }) => <p className="mb-4 text-gray-300 m-2" {...props} />,
    a: ({ ...props }) => (
      <a className="text-blue-400 hover:underline" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="list-disc pl-2 m-4 text-gray-300" {...props} />
    ),
    ol: ({ ...props }) => (
      <ol className="list-decimal pl-2 m-4 text-gray-300" {...props} />
    ),
    li: ({ ...props }) => <li className="mb-1" {...props} />,
    blockquote: ({ ...props }) => (
      <blockquote className="border-l-4 border-gray-600 pl-4 py-2 mb-4 italic text-gray-400" {...props} />
    ),
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-md mb-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-800 rounded px-1 py-0.5 text-sm text-gray-300" {...props}>
          {children}
        </code>
      );
    },
    table: ({ ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-700" {...props} />
      </div>
    ),
    th: ({ ...props }) => (
      <th className="border border-gray-700 px-4 py-2 bg-gray-800 font-semibold text-gray-200" {...props} />
    ),
    td: ({ ...props }) => (
      <td className="border border-gray-700 px-4 py-2 text-gray-300" {...props} />
    ),
    img: ({ ...props }) => (
      <img className="max-w-full h-auto my-4 rounded-md" {...props} />
    ),
    root: ({ children, ...props }) => (
      <div className="markdown-root" {...props}>
        {children}
      </div>
    )
  };
  
export const lightModeComponents = {
      h1: ({ ...props }) => (
        <h1 className="text-4xl font-bold border-b border-gray-300 pb-2 mb-4 text-gray-900" {...props} />
      ),
      h2: ({ ...props }) => (
        <h2 className="text-3xl font-semibold mt-6 mb-4 text-gray-800" {...props} />
      ),
      h3: ({ ...props }) => (
        <h3 className="text-2xl font-semibold mt-5 mb-3 text-gray-700" {...props} />
      ),
      h4: ({ ...props }) => (
        <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-700" {...props} />
      ),
      h5: ({ ...props }) => (
        <h5 className="text-lg font-semibold mt-3 mb-2 text-gray-700" {...props} />
      ),
      h6: ({ ...props }) => (
        <h6 className="text-base font-semibold mt-3 mb-2 text-gray-700" {...props} />
      ),
      p: ({ ...props }) => <p className="mb-4 text-gray-700 m-2" {...props} />, 
      a: ({ ...props }) => (
        <a className="text-blue-600 hover:underline" {...props} />
      ),
      ul: ({ ...props }) => (
        <ul className="list-disc pl-8 mb-4 text-gray-700" {...props} />
      ),
      ol: ({ ...props }) => (
        <ol className="list-decimal pl-8 mb-4 text-gray-700" {...props} />
      ),
      li: ({ ...props }) => <li className="mb-1" {...props} />, 
      blockquote: ({ ...props }) => (
        <blockquote className="border-l-4 border-gray-400 pl-4 py-2 mb-4 italic text-gray-600" {...props} />
      ),
      code: ({ inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            style={prism}
            language={match[1]}
            PreTag="div"
            className="rounded-md mb-4"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-gray-200 rounded px-1 py-0.5 text-sm text-gray-800" {...props}>
            {children}
          </code>
        );
      },
      table: ({ ...props }) => (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border-collapse border border-gray-400" {...props} />
        </div>
      ),
      th: ({ ...props }) => (
        <th className="border border-gray-400 px-4 py-2 bg-gray-300 font-semibold text-gray-800" {...props} />
      ),
      td: ({ ...props }) => (
        <td className="border border-gray-400 px-4 py-2 text-gray-700" {...props} />
      ),
      img: ({ ...props }) => (
        <img className="max-w-full h-auto my-4 rounded-md" {...props} />
      ),
      root: ({ children, ...props }) => (
        <div className="markdown-root" {...props}>
          {children}
        </div>
      )
  };
  