import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <Image src="/assets/images/logo.svg" alt="logo" height={50} width={50}  className="object-contain" />
  )
}

export default Logo