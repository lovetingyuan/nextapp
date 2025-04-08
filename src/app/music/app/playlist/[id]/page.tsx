export default async function PlayListPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return <div>PlayListPage {id}</div>
}
