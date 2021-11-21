
export const FIREBOX: IProviderInfo = {
  id: "firebox",
  name: "Firebox",
  type: "web",
  check: "isFirebox",
  package: {
    required: ["apiKey"]
  }
};