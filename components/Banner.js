import Link from 'next/link'

export default function Banner() {
  return (
    <div className="relative rounded-xl bg-indigo-600">
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:px-16 sm:text-center">
          <p className="font-medium text-white">
            <span className="md:hidden">Check out our newest post!</span>
            <span className="hidden md:inline">
              Check out our new blog post on tabnabbing and reverse tabnabbing!
            </span>
            <span className="block sm:ml-2 sm:inline-block">
              <button
                className="font-bold text-white underline"
                onClick={() => {
                  typeof window !== 'undefined' && window.open('https://tabnabbing.vercel.app/blog')
                }}
              >
                Read now<span aria-hidden="true">&rarr;</span>
              </button>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
