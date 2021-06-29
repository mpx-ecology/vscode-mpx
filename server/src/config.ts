export interface VLSFormatConfig {
  defaultFormatter: {
    [lang: string]: string;
  };
  defaultFormatterOptions: {
    prettier: any;
    [lang: string]: any;
  };
  scriptInitialIndent: boolean;
  styleInitialIndent: boolean;
  mpxIndentScriptAndStyle: boolean;
  options: {
    tabSize: number;
    useTabs: boolean;
  };
}
