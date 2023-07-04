export function isUUID(value: string): boolean {
  const uuidv4Regex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  return uuidv4Regex.test(value);
}
