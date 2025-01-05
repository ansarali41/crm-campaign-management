import { Editor } from '@tinymce/tinymce-react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

interface HtmlEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    label?: string;
}

const HtmlEditor = forwardRef<{ value: string }, HtmlEditorProps>(({ value, onChange, error, label }, ref) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);

    useImperativeHandle(ref, () => ({
        value: editorRef.current ? editorRef.current.getContent() : '',
    }));

    return (
        <div className="space-y-2" suppressHydrationWarning>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // Get a free API key from https://www.tiny.cloud/
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={value}
                onEditorChange={onChange}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'code',
                        'help',
                        'wordcount',
                    ],
                    toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

HtmlEditor.displayName = 'HtmlEditor';

export default HtmlEditor;
