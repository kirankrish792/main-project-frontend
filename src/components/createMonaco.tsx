import * as monaco from "monaco-editor";
import { createEffect, JSX, onCleanup, onMount } from "solid-js";

type Options = monaco.editor.IStandaloneEditorConstructionOptions;

export const Editor = (
  props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> & {
    options?: Options;
    overrides?: monaco.editor.IEditorOverrideServices;
    onChange?: (value: string) => void;
    value?: () => string;
  }
) => {
  let editor: monaco.editor.IStandaloneCodeEditor | null = null;
  let monacoEl: HTMLDivElement;
  console.log(monaco);
  createEffect(() => {
    if (props.value) {
      editor?.setValue(props.value());
    }
  });
  onMount(() => {
    console.log(monacoEl);
    if (monacoEl && !editor) {
      editor = monaco.editor.create(monacoEl!, props.options, props.overrides);
      editor.onDidChangeModelContent((e) => {
        props.onChange?.(editor?.getValue() || "");
      });
      if (props.value) {
        editor?.setValue(props.value());
      }
    }
    onCleanup(() => {
      if (editor) {
        editor.dispose();
        editor = null;
      }
    });
  });

  return <div {...props} onChange={undefined} ref={(e) => (monacoEl = e)} />;
};
