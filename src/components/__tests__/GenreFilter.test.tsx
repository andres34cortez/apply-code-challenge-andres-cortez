import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GenreFilter } from '../GenreFilter'
import { useRouter, useSearchParams } from 'next/navigation'

jest.mock('next/navigation')

const mockPush = jest.fn()
const mockSearchParams = new URLSearchParams()

describe('GenreFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    mockSearchParams.delete('genre')
    mockSearchParams.delete('page')
  })

  it('should render genre filter with All option', () => {
    render(<GenreFilter availableFilters={['Action', 'RPG']} />)

    expect(screen.getByLabelText(/genre:/i)).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument()
  })

  it('should render available filters as options', () => {
    render(<GenreFilter availableFilters={['Action', 'RPG', 'Strategy']} />)

    expect(screen.getByRole('option', { name: 'Action' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'RPG' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Strategy' })).toBeInTheDocument()
  })

  it('should show current genre from URL params', () => {
    mockSearchParams.set('genre', 'Action')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

    render(<GenreFilter availableFilters={['Action', 'RPG']} />)

    const select = screen.getByLabelText(/genre:/i) as HTMLSelectElement
    expect(select.value).toBe('Action')
  })

  it('should navigate to filtered URL when genre is selected', async () => {
    const user = userEvent.setup()
    render(<GenreFilter availableFilters={['Action', 'RPG']} />)

    const select = screen.getByLabelText(/genre:/i)
    await user.selectOptions(select, 'Action')

    expect(mockPush).toHaveBeenCalledWith('/?genre=Action')
  })

  it('should remove genre param when All is selected', async () => {
    const user = userEvent.setup()
    mockSearchParams.set('genre', 'Action')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

    render(<GenreFilter availableFilters={['Action', 'RPG']} />)

    const select = screen.getByLabelText(/genre:/i)
    await user.selectOptions(select, 'All')

    expect(mockPush).toHaveBeenCalledWith('/?')
  })

  it('should reset page when genre changes', async () => {
    const user = userEvent.setup()
    mockSearchParams.set('page', '2')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

    render(<GenreFilter availableFilters={['Action', 'RPG']} />)

    const select = screen.getByLabelText(/genre:/i)
    await user.selectOptions(select, 'Action')

    // Should not include page param
    expect(mockPush).toHaveBeenCalledWith('/?genre=Action')
  })
})

