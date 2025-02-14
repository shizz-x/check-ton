// account-extension.d.ts
import { Account } from "@tonconnect/ui-react";

declare module "@tonconnect/ui-react" {
  interface Account {
    friendlyAddress?: string; // добавляем optional поле
  }
}
