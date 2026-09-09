import Image from 'next/image'
import Dev from '@/assets/images/dev.png'
export default function Footer() {
  return (
    <div>
      <hr className='mt-5 mb-5 w-100 mx-auto' />
      <p className='text-center text-gray-500 text-sm'>
        Copyright © 2026 Manage Task App. All rights reserved
      </p>
      <br />
      <Image
        src={Dev}
        width={100}
        height={100}
        alt='dev'
        className='mx-auto'
      />
      <p className='text-center text-gray-500 text-sm'>
        Developed by <span className='font-bold'>Your Name</span>
      </p>
    </div>
  )
}