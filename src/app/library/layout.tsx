import { Metadata } from 'next'
import { generateMetadata } from './metadata'

export const metadata: Metadata = generateMetadata()

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children
}
