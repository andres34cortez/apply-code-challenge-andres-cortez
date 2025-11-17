import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('should render Apply Digital logo', () => {
    render(<Footer />)

    const logoLink = screen.getByRole('link')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('should render logo image with correct alt text', () => {
    render(<Footer />)

    const logoImage = screen.getByAltText('Apply Digital')
    expect(logoImage).toBeInTheDocument()
  })
})

