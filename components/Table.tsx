import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, ColumnDef } from '@tanstack/react-table'
import { Study, BODY_PART, MODALITY } from '../pages/api/types'
import { CaretLeft, CaretRight, DoubleCaretLeft, DoubleCaretRight } from '../styles/icons'
import Select from 'react-select'
import { useState } from 'react'

const columns : ColumnDef<Study>[] = [
	{ accessorKey: 'id', header: 'ID' },
	{ accessorKey: 'date', header: 'DATE' },
	{ accessorKey: 'revenue', header: 'REVENUE', cell: info => typeof info.getValue() === 'undefined' ? '' : <span className='text-success'>${(info.getValue() as number).toLocaleString()}</span> },
	{ accessorKey: 'modality', header: 'MODALITY' },
	{ accessorKey: 'body_part', header: 'BODY PART' },
	{ accessorKey: 'sla', header: 'SLA', cell: info => typeof info.getValue() === 'undefined' ? '' : info.getValue() + '%' },
]

const groupedOptions = [
	{ label: 'Body Part', options: Object.values(BODY_PART).map(part => ({ value: part, label: part })) },
	{ label: 'Modality', options: Object.values(MODALITY).map(part => ({ value: part, label: part })) }
]

// Sort of a design choice here on the filter. Figure it's better to filter by multiple modalities and body parts vs doing a 1:1 relationship when selecting both a modality filter and a body part filter.
export default function Table({data: initialData} : {data: Study[]}){

	// Incredibly slow. May be faster through proper filter implementation/memoization.
	const [data, setData] = useState(initialData)

	const table = useReactTable({ 
		data, 
		columns, 
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	})

	return(<div className='w-full mt-4'>
		<h2 className='text-3xl font-semibold'>STUDIES</h2>
		<div className="mb-2 flex items-center justify-between gap-8">
			<div>
				<h5 className='font-semibold text-lightText mb-2'>Filter by <span className='text-white'>BODY PART</span> or <span className='text-white'>MODALITY</span></h5>
				<Select options={groupedOptions} formatGroupLabel={(data) => (<div className='text-white text-base'><span>{data.label}</span><span className='bg-accentDark p-1 rounded ml-2'>{data.options.length}</span></div>)} onChange={(val) => setData([...initialData].filter(obj => {
					// @ts-ignore Something with importing GroupOption Type
					const filters = val.map(o => o.value)
					if(filters.length === 0) return true
					return(filters.includes(obj.body_part) || filters.includes(obj.modality))
				}))} isMulti={true}  className='w-full min-w-[300px]' styles={{
						control: (styles) => ({
							...styles,
							backgroundColor: 'var(--darkerText)',
							border: 'none',
							boxShadow: ''
						}),
						input: (styles) => ({ ...styles, color: '#FFF' }),
						indicatorSeparator: (styles) => ({ ...styles, backgroundColor: 'var(--borderBlack)' }),
						multiValue: (styles) => ({ ...styles, backgroundColor: 'var(--accentDark)' }),
						multiValueLabel: (styles) => ({ ...styles, color: '#FFF' }),
						menu: (styles) => ({ ...styles, backgroundColor: 'var(--bgColor)' }),
						option: (styles, {isSelected, isFocused}) => ({
							...styles,
							backgroundColor: isSelected ? 'var(--accentDark)' : isFocused ? 'var(--darkerText)' : 'none',
							':active': { backgroundColor: 'var(--accentLight)' }
						}),
			
					}} />
			</div>
			<div className=''>
				<h5 className='font-semibold text-lightText mb-2'>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</h5>
				<div className='flex gap-2'>
					<button disabled={!table.getCanPreviousPage()} onClick={() => table.setPageIndex(0)} className='button'><DoubleCaretLeft className='w-4 h-4' /></button>
					<button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} className='button'><CaretLeft className='w-4 h-4' /></button>
					<button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} className='button'><CaretRight className='w-4 h-4' /></button>
					<button disabled={!table.getCanNextPage()} onClick={() => table.setPageIndex(table.getPageCount() - 1)} className='button'><DoubleCaretRight className='w-4 h-4' /></button>
				</div>
			</div>
		</div>
		<table className='table'>
			<thead>
			{table.getHeaderGroups().map(headerGroup => (
				<tr key={headerGroup.id}>
					{headerGroup.headers.map(header => (
						<th key={header.id} className='p-2 bg-accentDark'>{flexRender(header.column.columnDef.header, header.getContext() )}</th>
					))}
				</tr>
			))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map(row => (
					<tr key={row.id}>
						{row.getVisibleCells().map(cell => (
							<td key={cell.id} className='p-2'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</div>)
}