import Image from "next/image"
import Select from 'react-select'
import { User } from "../pages/api/types"

const parseSelectOptions = (users: User[]) => users.map(user => ({ value: user.id, label: user.name }))

export default function Header({users, setUser, isFetching} : { users: User[], setUser: (user: User) => void, isFetching: boolean}){

	const options = parseSelectOptions(users)

	return(
		<header className="w-full h-16">
			<section className="max-w-7xl mx-auto w-full h-full flex items-center border-b border-borderBlack px-4">
				<div className="w-96">
					<Image src={'/logo.png'} width={175} height={34} alt='logo' />
				</div>
				<Select onChange={(selectedUser) => setUser(users.find(u => u.id === selectedUser?.value) || users[0])} options={options} defaultValue={options[0]} isLoading={isFetching} isDisabled={isFetching} className='w-64' styles={{
					control: (styles) => ({
						...styles,
						backgroundColor: 'var(--darkerText)',
						border: 'none',
						boxShadow: ''
					}),
					singleValue: (styles) => ({ ...styles, color: '#FFF' }),
					indicatorSeparator: (styles) => ({ ...styles, backgroundColor: 'var(--borderBlack)' }),
					menu: (styles) => ({ ...styles, backgroundColor: 'var(--bgColor)' }),
					option: (styles, {isSelected, isFocused}) => ({
						...styles,
						backgroundColor: isSelected ? 'var(--accentDark)' : isFocused ? 'var(--darkerText)' : 'none',
						':active': { backgroundColor: 'var(--accentLight)' }
					}),
		
				}} />
			</section>
		</header>
	)
}