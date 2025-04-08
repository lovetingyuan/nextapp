'use client'

export default function ErrorTip(props: { message: string }) {
  return <div className="text-red-500 my-6">{props.message}</div>
}
