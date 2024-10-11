declare module 'react-quill' {
    import { Component } from 'react';
  
    interface QuillProps {
      value: string;
      onChange: (content: string, delta: any, source: any, editor: any) => void;
      // add more props as needed
    }
  
    export default class Quill extends Component<QuillProps> {}
  }
  