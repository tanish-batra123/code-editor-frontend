import { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { Actions } from "../../action";

export const Editor = ({ socketref, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const isRemoteChange = useRef(false);

  // ---------------- SEND CODE WHEN TYPING ----------------
  const extensions = [
    javascript(),
    EditorView.updateListener.of((update) => {
      if (!update.docChanged) return;

      if (isRemoteChange.current) {
        isRemoteChange.current = false;
        return;
      }

      const code = update.state.doc.toString();
      onCodeChange(code);

      socketref.current?.emit(Actions.CODE_CHANGE, {
        roomId,
        code,
      });
    }),
  ];

  // ---------------- RECEIVE CODE ----------------
  useEffect(() => {
  if (!socketref.current) return;

  const handleCodeChange = ({ code }) => {
    if (code == null) return;

    const view = editorRef.current;
    if (!view) return;

    isRemoteChange.current = true;

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: code,
      },
    });
  };

  socketref.current.on(Actions.CODE_CHANGE, handleCodeChange);

  return () => {
    socketref.current?.off(Actions.CODE_CHANGE, handleCodeChange);
  };
}, [socketref.current]);


  return (
    <CodeMirror
      height="100%"
      theme={oneDark}
      extensions={extensions}
      onCreateEditor={(view) => (editorRef.current = view)}
     
    />
  );
};
