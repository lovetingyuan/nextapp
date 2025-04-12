import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  console.log('dashboard page')
  return redirect('/music/app/songs')
}
