import { useNode } from '@craftjs/core'

// DynamicContent component
export const DynamicContent = ({ children }) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	return (
		<div
    ref={(ref) => connect(drag(ref)) as any}
			// className="bg-yellow-100 p-4 min-h-[100px] m-2 border border-dashed border-yellow-300"
		>
			{/* <h3 className="text-lg font-medium mb-2 border border-blue-400">Dynamic Content Container</h3> */}
			{children}
		</div>
	)
}

DynamicContent.craft = {
	displayName: 'Dynamic Content'
}
