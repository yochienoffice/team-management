export type TabContent = {
  title: string;
  hint?: PopupHint | null;
  displayHint?: boolean | null;
  url: string;
};

export type PopupHint = {
  header?: string;
  body?: string;
  footer?: string;
};

export type MemberItem = {
  number: number;
  displayName: string;
  identity: string;
  birthDate: string;
};


