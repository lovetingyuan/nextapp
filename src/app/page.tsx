import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-20">
      <h2 className="text-xl">一些app</h2>
      <ul className="list-disc list-inside my-10">
        <li>
          <Link href={'/translate'}>Translate</Link>
        </li>
      </ul>
    </main>
  )
}
