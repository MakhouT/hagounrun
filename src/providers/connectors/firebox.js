// src/providers/connectors/firebox.ts

import { IAbstractConnectorOptions } from "../../helpers";

interface IFireboxOptions extends IAbstractConnectorOptions {
  apiKey: string;
}

const ConnectToFirebox = async (
  FireboxProvider: any,
  opts: IFireboxOptions
) => {
  const provider = new FireboxProvider(opts.apiKey);

  await provider.enable();

  return provider;
};