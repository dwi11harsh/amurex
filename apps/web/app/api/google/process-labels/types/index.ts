export interface Message {
  id: string;
  threadId: string;
  labelIds?: string[];
}

export interface FullMessage {
  data: {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
    internalDate: string;
    payload: {
      headers?: Array<{ name: string; value: string }>;
      body?: {
        data?: string;
      };
      parts?: Array<{
        mimeType: string;
        body?: {
          data?: string;
        };
        parts?: Array<{
          mimeType: string;
          body?: {
            data?: string;
          };
        }>;
      }>;
      mimeType?: string;
    };
  };
}

export interface LabelRequestBody {
  name: string;
  labelListVisibility: string;
  messageListVisibility: string;
  color?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

export interface GmailMessagePart {
  mimeType?: string;
  body?: {
    data?: string;
    size?: number;
  };
  parts?: GmailMessagePart[];
  headers?: Array<{
    name: string;
    value: string;
  }>;
}
