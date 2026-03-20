const STORAGE_KEY = 'rma_tool_cases';

export function loadCases<T>(): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function saveCases<T>(cases: T[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
