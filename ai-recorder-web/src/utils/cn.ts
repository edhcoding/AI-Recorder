import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// clsx와 tailwind-merge를 통해 조건부 className과 className 충돌을 방지하는 유틸함수
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
