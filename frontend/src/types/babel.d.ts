// frontend/src/types/babel.d.ts (CRIAR NOVO ARQUIVO)

declare module '@babel/standalone' {
  export interface TransformOptions {
    presets?: string[];
    filename?: string;
    [key: string]: any;
  }

  export interface TransformResult {
    code: string;
    map?: any;
    ast?: any;
  }

  export function transform(code: string, options?: TransformOptions): TransformResult;
}
